import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import User from '../models/user.model.js';
import ParkingLot from '../models/parkingLot.model.js';
import ParkingSlot from '../models/parkingSlot.model.js';

// Load environment variables
dotenv.config();

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
  if (!mongoUri) {
    console.error('Error: MONGODB_URI is not defined in the environment variables.');
    process.exit(1);
  }

  console.log('Connecting to MongoDB Atlas...');
  await mongoose.connect(mongoUri);
  console.log('Connected successfully.');

  try {
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

    for (const lotSpec of allLotsToSeed) {
      // 2. Check if Lot already exists
      let lotDoc = await ParkingLot.findOne({ name: lotSpec.name, city: lotSpec.city });
      if (!lotDoc) {
        console.log(`Seeding parking lot: ${lotSpec.name} (${lotSpec.city})...`);
        lotDoc = await ParkingLot.create({
          ...lotSpec,
          approvalStatus: 'approved',
          isActive: true,
          owner: ownerUser._id,
          createdBy: ownerUser._id,
          totalSlots: 0,
          availableSlots: 0,
        });
      } else {
        console.log(`Skipping existing parking lot: ${lotSpec.name} (${lotSpec.city})`);
      }

      // 3. Seed slots if lot has no slots configured
      const existingSlotsCount = await ParkingSlot.countDocuments({ parkingLot: lotDoc._id });
      if (existingSlotsCount === 0) {
        console.log(`Seeding slots for parking lot: ${lotDoc.name}...`);
        
        // Generate 10 slots (A1-A3, B1-B3, C1-C2, D1-D2)
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

        // Calculate count metrics
        const total = createdSlots.length;
        const available = createdSlots.filter((s) => s.status === 'available').length;

        lotDoc.totalSlots = total;
        lotDoc.availableSlots = available;
        await lotDoc.save();
        console.log(`Seeded ${total} slots (${available} available) successfully for ${lotDoc.name}.`);
      } else {
        console.log(`Slots already configured for: ${lotDoc.name} (Count: ${existingSlotsCount})`);
      }
    }

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
