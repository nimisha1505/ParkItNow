const crypto = require('crypto');
const QRCode = require('qrcode');
const bookingRepository = require('../repositories/booking.repository');
const ApiError = require('../utils/apiError');

class QrService {
  /**
   * Helper to format booking document into safe details response.
   */
  getSafeBookingDetails(booking) {
    return {
      bookingReference: booking.bookingReference,
      parkingLot: booking.parkingLot,
      parkingSlot: booking.parkingSlot,
      vehicle: booking.vehicle,
      startTime: booking.startTime,
      endTime: booking.endTime,
      entryStatus: booking.entryStatus,
    };
  }

  /**
   * Generate a secure QR Pass for a confirmed booking.
   * Invalidates any previously issued QR passes.
   */
  async generateQrPass(userId, bookingId) {
    const booking = await bookingRepository.findById(bookingId);
    if (!booking) {
      throw new ApiError(404, 'Booking not found');
    }

    if (booking.user._id.toString() !== userId.toString()) {
      throw new ApiError(403, 'Forbidden: You can only generate QR passes for your own bookings');
    }

    if (booking.status !== 'confirmed') {
      throw new ApiError(400, 'QR Pass can only be generated for confirmed bookings');
    }

    // Generate secure random token and its SHA-256 hash
    const qrToken = crypto.randomBytes(32).toString('hex');
    const qrTokenHash = crypto.createHash('sha256').update(qrToken).digest('hex');

    // Save token hash and issue time
    booking.qrTokenHash = qrTokenHash;
    booking.qrIssuedAt = new Date();
    await booking.save();

    // Create the payload and render to QR Image Data URL
    const qrPayload = JSON.stringify({
      bookingReference: booking.bookingReference,
      qrToken,
    });

    const qrCodeImage = await QRCode.toDataURL(qrPayload);

    return {
      bookingReference: booking.bookingReference,
      qrCode: qrCodeImage,
    };
  }

  /**
   * Internal helper to verify and validate a QR pass.
   */
  async verifyQrPass(bookingReference, qrToken) {
    if (!bookingReference || !qrToken) {
      throw new ApiError(400, 'Booking reference and QR token are required');
    }

    const booking = await bookingRepository.findByReference(bookingReference);
    if (!booking) {
      throw new ApiError(404, 'Booking not found');
    }

    // Reject invalid statuses
    if (['cancelled', 'completed', 'expired'].includes(booking.status)) {
      throw new ApiError(400, `Booking cannot be verified because it is ${booking.status}`);
    }

    if (!booking.qrTokenHash) {
      throw new ApiError(400, 'No QR Pass has been generated for this booking');
    }

    // Verify token hash match
    const hash = crypto.createHash('sha256').update(qrToken).digest('hex');
    if (hash !== booking.qrTokenHash) {
      throw new ApiError(400, 'Invalid or tampered QR pass');
    }

    return booking;
  }

  /**
   * Check in user at parking entry.
   */
  async checkIn(adminId, bookingReference, qrToken) {
    const booking = await this.verifyQrPass(bookingReference, qrToken);

    if (booking.entryStatus === 'checked_in') {
      throw new ApiError(400, 'Booking is already checked in');
    }

    if (booking.entryStatus === 'checked_out') {
      throw new ApiError(400, 'Booking is already checked out');
    }

    booking.entryStatus = 'checked_in';
    booking.checkedInAt = new Date();
    booking.verifiedBy = adminId;

    await booking.save();

    return this.getSafeBookingDetails(booking);
  }

  /**
   * Check out user at parking exit, completing the booking.
   */
  async checkOut(adminId, bookingReference, qrToken) {
    const booking = await this.verifyQrPass(bookingReference, qrToken);

    if (booking.entryStatus === 'not_checked_in') {
      throw new ApiError(400, 'User must be checked in before check-out is allowed');
    }

    if (booking.entryStatus === 'checked_out') {
      throw new ApiError(400, 'Booking is already checked out');
    }

    booking.entryStatus = 'checked_out';
    booking.checkedOutAt = new Date();
    booking.status = 'completed';
    booking.verifiedBy = adminId;

    await booking.save();

    return this.getSafeBookingDetails(booking);
  }
}

module.exports = new QrService();
