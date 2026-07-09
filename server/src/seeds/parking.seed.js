import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../models/user.model.js';
import ParkingLot from '../models/parkingLot.model.js';
import ParkingSlot from '../models/parkingSlot.model.js';

// Resolve __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables using absolute path
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const DB_GWALIOR_LOTS = [
  {
    name: 'DB City Mall Parking',
    address: 'DB City Mall, Race Course Road, City Centre',
    city: 'Gwalior',
    area: 'City Centre',
    landmark: 'Near Gwalior Railway Station',
    coordinates: { lat: 26.2312, lng: 78.2012 },
    pricePerHour: 40,
    supportedVehicleTypes: ['car', 'bike', 'scooter', 'ev'],
    amenities: ['CCTV', 'Covered', 'EV Charger', 'Valet', '24/7 Access', 'Restrooms'],
  },
  {
    name: 'Dindayal City Mall Parking',
    address: 'Dindayal Mall, Maharaj Bada Road, Lashkar',
    city: 'Gwalior',
    area: 'Maharaj Bada',
    landmark: 'Opposite State Bank of India',
    coordinates: { lat: 26.2235, lng: 78.1965 },
    pricePerHour: 30,
    supportedVehicleTypes: ['car', 'bike', 'scooter'],
    amenities: ['CCTV', 'Covered', 'Restrooms'],
  },
  {
    name: 'Gwalior Railway Station Parking',
    address: 'Station Road, Lashkar',
    city: 'Gwalior',
    area: 'Station Area',
    landmark: 'Platform 1 Gate',
    coordinates: { lat: 26.2178, lng: 78.1884 },
    pricePerHour: 20,
    supportedVehicleTypes: ['car', 'bike', 'scooter'],
    amenities: ['CCTV', '24/7 Access', 'Restrooms'],
  },
  {
    name: 'Gwalior Fort Visitor Parking',
    address: 'Fort Road, Gwalior Fort',
    city: 'Gwalior',
    area: 'Fort Area',
    landmark: 'Near Man Singh Palace Entrance',
    coordinates: { lat: 26.2295, lng: 78.1705 },
    pricePerHour: 30,
    supportedVehicleTypes: ['car', 'bike', 'scooter'],
    amenities: ['CCTV', 'Restrooms'],
  },
  {
    name: 'Phool Bagh Public Parking',
    address: 'Phool Bagh Road, Lashkar',
    city: 'Gwalior',
    area: 'Phool Bagh',
    landmark: 'Near Gwalior Zoo Main Gate',
    coordinates: { lat: 26.2198, lng: 78.1842 },
    pricePerHour: 15,
    supportedVehicleTypes: ['car', 'bike', 'scooter', 'ev'],
    amenities: ['CCTV', 'EV Charger', '24/7 Access'],
  },
  {
    name: 'Lashkar Market Parking',
    address: 'Main Market Road, Lashkar',
    city: 'Gwalior',
    area: 'Lashkar',
    landmark: 'Opposite Central Library',
    coordinates: { lat: 26.2084, lng: 78.1632 },
    pricePerHour: 25,
    supportedVehicleTypes: ['car', 'bike', 'scooter'],
    amenities: ['CCTV', 'Restrooms'],
  },
  {
    name: 'City Centre Parking Hub',
    address: 'Main City Centre Road',
    city: 'Gwalior',
    area: 'City Centre',
    landmark: 'Next to HDFC Bank Regional Office',
    coordinates: { lat: 26.2242, lng: 78.2045 },
    pricePerHour: 35,
    supportedVehicleTypes: ['car', 'bike', 'scooter', 'ev'],
    amenities: ['CCTV', 'Covered', 'EV Charger', '24/7 Access', 'Restrooms'],
  },
  {
    name: 'Maharaj Bada Market Parking',
    address: 'Maharaj Bada Circle, Lashkar',
    city: 'Gwalior',
    area: 'Maharaj Bada',
    landmark: 'Underground public facility',
    coordinates: { lat: 26.2052, lng: 78.1584 },
    pricePerHour: 20,
    supportedVehicleTypes: ['car', 'bike', 'scooter'],
    amenities: ['CCTV', 'Covered', 'Restrooms'],
  },
];

const DB_INDORE_LOTS = [
  {
    name: 'Phoenix Citadel Mall Parking',
    address: 'Phoenix Citadel, MR 10 Road',
    city: 'Indore',
    area: 'Vijay Nagar Area',
    landmark: 'Next to Bypass Highway Junction',
    coordinates: { lat: 22.7485, lng: 75.9462 },
    pricePerHour: 50,
    supportedVehicleTypes: ['car', 'bike', 'scooter', 'ev'],
    amenities: ['CCTV', 'Covered', 'EV Charger', 'Valet', '24/7 Access', 'Restrooms'],
  },
  {
    name: 'Treasure Island Mall Parking',
    address: '11 MG Road, South Tukoganj',
    city: 'Indore',
    area: 'MG Road',
    landmark: 'Near Indraprastha Tower',
    coordinates: { lat: 22.7214, lng: 75.8795 },
    pricePerHour: 40,
    supportedVehicleTypes: ['car', 'bike', 'scooter'],
    amenities: ['CCTV', 'Covered', 'Valet', 'Restrooms'],
  },
  {
    name: 'C21 Malhar Mall Parking',
    address: 'AB Road, Vijay Nagar Sector A',
    city: 'Indore',
    area: 'Vijay Nagar',
    landmark: 'Near Radisson Blu Junction',
    coordinates: { lat: 22.7441, lng: 75.8926 },
    pricePerHour: 45,
    supportedVehicleTypes: ['car', 'bike', 'scooter', 'ev'],
    amenities: ['CCTV', 'Covered', 'EV Charger', 'Restrooms'],
  },
  {
    name: 'Vijay Nagar Public Parking',
    address: 'Vijay Nagar Square, AB Road',
    city: 'Indore',
    area: 'Vijay Nagar',
    landmark: 'Behind Vijay Nagar Police Station',
    coordinates: { lat: 22.7533, lng: 75.8937 },
    pricePerHour: 25,
    supportedVehicleTypes: ['car', 'bike', 'scooter', 'ev'],
    amenities: ['CCTV', '24/7 Access', 'Restrooms'],
  },
];

const seedParkingData = async () => {
  const mongoUri = process.env.MONGODB_URI;
  console.log(`MONGODB_URI exists: ${!!mongoUri}`);
  console.log(`DB_NAME value: ${process.env.DB_NAME}`);

  if (!mongoUri) {
    console.error('Error: MONGODB_URI is not defined in the environment variables.');
    process.exit(1);
  }

  console.log('Connecting to MongoDB Atlas...');
  await mongoose.connect(mongoUri, {
    dbName: process.env.DB_NAME || "parkitnow"
  });
  console.log('Connected successfully.');

  try {
    const dbName = mongoose.connection.name || mongoose.connection.db.databaseName;
    console.log(`connected database name: ${dbName}`);

    const lotsBefore = await ParkingLot.countDocuments();
    console.log(`parking lot count before seed: ${lotsBefore}`);

    // 1. Create or Find Demo Owner
    const ownerEmail = 'demo.owner@parkitnow.com';
    let ownerUser = await User.findOne({ email: ownerEmail });
    if (!ownerUser) {
      console.log('Creating Demo Owner user...');
      ownerUser = await User.create({
        name: 'ParkItNow Demo Owner',
        email: ownerEmail,
        role: 'owner',
        password: 'Demo@12345',
      });
      console.log(`Demo Owner created: ${ownerUser._id}`);
    } else {
      console.log(`Reusing existing Demo Owner: ${ownerUser._id}`);
    }

    const allLotsToSeed = [...DB_GWALIOR_LOTS, ...DB_INDORE_LOTS];
    let totalSlotsCreatedOrUpdated = 0;

    for (const lotSpec of allLotsToSeed) {
      const lotQuery = {
        name: lotSpec.name,
        city: lotSpec.city,
      };

      const updateData = {
        ...lotSpec,
        city: lotSpec.city,
        area: lotSpec.area,
        approvalStatus: 'approved',
        isActive: true,
        owner: ownerUser._id,
        createdBy: ownerUser._id,
      };

      // 2. Use findOneAndUpdate with upsert: true based on name and city
      const lotDoc = await ParkingLot.findOneAndUpdate(
        lotQuery,
        { $set: updateData },
        { upsert: true, new: true, runValidators: true }
      );

      console.log(`Processed parking lot: ${lotDoc.name} (${lotDoc.city}) - approvalStatus forced to approved`);

      // 3. Link slots
      const existingSlotsCount = await ParkingSlot.countDocuments({ parkingLot: lotDoc._id });
      let lotTotalSlots = existingSlotsCount;
      let lotAvailableSlots = 0;

      if (existingSlotsCount === 0) {
        const slotsToCreate = [
          { slotNumber: 'A1', floor: 'Ground', section: 'Sec A', status: 'available' },
          { slotNumber: 'A2', floor: 'Ground', section: 'Sec A', status: 'occupied' },
          { slotNumber: 'A3', floor: 'Ground', section: 'Sec A', status: 'available' },
          { slotNumber: 'B1', floor: 'Ground', section: 'Sec B', status: 'reserved' },
          { slotNumber: 'B2', floor: 'Ground', section: 'Sec B', status: 'available' },
          { slotNumber: 'B3', floor: 'Ground', section: 'Sec B', status: 'maintenance' },
          { slotNumber: 'C1', floor: '1st Floor', section: 'Sec C', status: 'available' },
          { slotNumber: 'C2', floor: '1st Floor', section: 'Sec C', status: 'occupied' },
          { slotNumber: 'D1', floor: '1st Floor', section: 'Sec D', status: 'available' },
          { slotNumber: 'D2', floor: '1st Floor', section: 'Sec D', status: 'available' },
        ];

        const createdSlots = await Promise.all(
          slotsToCreate.map((slot) =>
            ParkingSlot.create({
              parkingLot: lotDoc._id,
              slotNumber: slot.slotNumber,
              floor: slot.floor,
              section: slot.section,
              supportedVehicleTypes: lotDoc.supportedVehicleTypes,
              status: slot.status,
              createdBy: ownerUser._id,
            })
          )
        );
        lotTotalSlots = createdSlots.length;
        lotAvailableSlots = createdSlots.filter((s) => s.status === 'available').length;
        totalSlotsCreatedOrUpdated += createdSlots.length;
      } else {
        const allSlots = await ParkingSlot.find({ parkingLot: lotDoc._id });
        lotTotalSlots = allSlots.length;
        lotAvailableSlots = allSlots.filter((s) => s.status === 'available').length;
        totalSlotsCreatedOrUpdated += allSlots.length;
      }

      lotDoc.totalSlots = lotTotalSlots;
      lotDoc.availableSlots = lotAvailableSlots;
      await lotDoc.save();
    }

    const lotsAfter = await ParkingLot.countDocuments();
    console.log(`parking lot count after seed: ${lotsAfter}`);

    const gwaliorApprovedCount = await ParkingLot.countDocuments({
      city: 'gwalior',
      approvalStatus: 'approved',
      isActive: true,
    });
    console.log(`approved active Gwalior lot count after seed: ${gwaliorApprovedCount}`);

    const indoreApprovedCount = await ParkingLot.countDocuments({
      city: 'indore',
      approvalStatus: 'approved',
      isActive: true,
    });
    console.log(`approved active Indore lot count after seed: ${indoreApprovedCount}`);

    console.log(`number of slots created or already existing: ${totalSlotsCreatedOrUpdated}`);
    console.log('Seeding process completed successfully!');
  } catch (err) {
    console.error('Seeding process encountered an error:', err);
  } finally {
    console.log('Disconnecting database...');
    await mongoose.disconnect();
    console.log('Disconnected.');
  }
};

seedParkingData();
