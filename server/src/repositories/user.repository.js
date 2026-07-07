const User = require('../models/user.model');

class UserRepository {
  async findByEmail(email) {
    return await User.findOne({ email });
  }

  async findById(id) {
    return await User.findById(id);
  }

  async create(userData) {
    return await User.create(userData);
  }

  async save(userInstance) {
    return await userInstance.save();
  }

  async updateRefreshToken(userId, refreshToken) {
    return await User.findByIdAndUpdate(
      userId,
      { $set: { refreshToken } },
      { new: true }
    );
  }

  async clearRefreshToken(userId) {
    return await User.findByIdAndUpdate(
      userId,
      { $unset: { refreshToken: 1 } },
      { new: true }
    );
  }
}

module.exports = new UserRepository();
