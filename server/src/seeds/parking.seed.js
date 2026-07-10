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

const BASE_GWALIOR_LOTS = [
  {
    name: 'DB City Mall Parking',
    address: 'DB City Mall, Race Course Road, City Centre',
    city: 'Gwalior',
    area: 'City Centre',
    landmark: 'Near Gwalior Railway Station',
    coordinates: { lat: 26.2312, lng: 78.2012 },
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
    supportedVehicleTypes: ['car', 'bike', 'scooter', 'ev'],
    amenities: ['CCTV', 'Covered', 'Restrooms'],
  },
  {
    name: 'Gwalior Railway Station Parking',
    address: 'Station Road, Lashkar',
    city: 'Gwalior',
    area: 'Station Area',
    landmark: 'Platform 1 Gate',
    coordinates: { lat: 26.2178, lng: 78.1884 },
    supportedVehicleTypes: ['car', 'bike', 'scooter', 'ev'],
    amenities: ['CCTV', '24/7 Access', 'Restrooms'],
  },
  {
    name: 'Gwalior Fort Visitor Parking',
    address: 'Fort Road, Gwalior Fort',
    city: 'Gwalior',
    area: 'Fort Area',
    landmark: 'Near Man Singh Palace Entrance',
    coordinates: { lat: 26.2295, lng: 78.1705 },
    supportedVehicleTypes: ['car', 'bike', 'scooter', 'ev'],
    amenities: ['CCTV', 'Restrooms'],
  },
  {
    name: 'Phool Bagh Public Parking',
    address: 'Phool Bagh Road, Lashkar',
    city: 'Gwalior',
    area: 'Phool Bagh',
    landmark: 'Near Gwalior Zoo Main Gate',
    coordinates: { lat: 26.2198, lng: 78.1842 },
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
    supportedVehicleTypes: ['car', 'bike', 'scooter', 'ev'],
    amenities: ['CCTV', 'Restrooms'],
  },
  {
    name: 'City Centre Parking Hub',
    address: 'Main City Centre Road',
    city: 'Gwalior',
    area: 'City Centre',
    landmark: 'Next to HDFC Bank Regional Office',
    coordinates: { lat: 26.2242, lng: 78.2045 },
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
    supportedVehicleTypes: ['car', 'bike', 'scooter', 'ev'],
    amenities: ['CCTV', 'Covered', 'Restrooms'],
  },
];

// Seed arrays for other cities: 3 lots per city
const OTHER_MP_CITIES = [
  'Indore', 'Bhopal', 'Jabalpur', 'Ujjain', 'Sagar', 'Rewa', 'Satna', 'Dewas', 'Ratlam'
];

const generateLotsArray = () => {
  const lots = [...BASE_GWALIOR_LOTS];

  OTHER_MP_CITIES.forEach((cityName, cityIdx) => {
    // Generate 3 lots per city
    for (let lotIdx = 1; lotIdx <= 3; lotIdx++) {
      lots.push({
        name: `${cityName} Premium Lot ${lotIdx}`,
        address: `Main Road Sector ${lotIdx}, ${cityName}`,
        city: cityName,
        area: `Sector ${lotIdx}`,
        landmark: `Near Town Hall ${lotIdx}`,
        coordinates: { lat: 22.0 + cityIdx * 0.5 + lotIdx * 0.1, lng: 75.0 + cityIdx * 0.5 + lotIdx * 0.1 },
        supportedVehicleTypes: ['car', 'bike', 'scooter', 'ev'],
        amenities: ['CCTV', 'Covered', '24/7 Access'],
      });
    }
  });

  return lots.map((lot, index) => {
    let twoWheeler = 5;
    let fourWheeler = 20;
    let evPrice = 0;

    const nameLower = lot.name.toLowerCase();
    
    if (nameLower.includes('mall') || nameLower.includes('premium')) {
      // Mall / Premium
      twoWheeler = index % 2 === 0 ? 10 : 15;
      fourWheeler = index % 2 === 0 ? 30 : 40;
      evPrice = 50;
    } else if (nameLower.includes('railway') || nameLower.includes('station')) {
      // Railway / Station
      twoWheeler = 10;
      fourWheeler = index % 2 === 0 ? 25 : 30;
      evPrice = 40;
    } else {
      // Public / Market / Visitor / Phool Bagh
      twoWheeler = index % 2 === 0 ? 5 : 10;
      fourWheeler = index % 2 === 0 ? 15 : 20;
      evPrice = 35;
    }

    // EV charging: True for specific/alternate lots or if lot has 'EV Charger' in amenities
    const isEvAvailable = lot.amenities?.includes('EV Charger') || (index % 2 === 0);
    const evCharging = {
      available: isEvAvailable,
      chargingSlots: isEvAvailable ? 2 + (index % 3) : 0,
      pricePerHour: isEvAvailable ? evPrice : 0,
      connectorTypes: isEvAvailable 
        ? (index % 3 === 0 ? ['Type 2', 'CCS'] : index % 3 === 1 ? ['CCS', 'CHAdeMO'] : ['Type 2', 'Bharat AC001'])
        : []
    };

    // Override some Gwalior lots for matching target outputs:
    if (lot.name === 'DB City Mall Parking') {
      twoWheeler = 15;
      fourWheeler = 40;
      evCharging.available = true;
      evCharging.pricePerHour = 50;
    } else if (lot.name === 'Lashkar Market Parking') {
      twoWheeler = 5;
      fourWheeler = 20;
      evCharging.available = false;
      evCharging.pricePerHour = 0;
    }

    return {
      ...lot,
      pricePerHour: fourWheeler, // backward compatibility
      pricePerHourByVehicleCategory: {
        twoWheeler,
        fourWheeler
      },
      evCharging
    };
  });
};

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

    // 1. Create or Find Demo Users
    const usersToSeed = [
      {
        email: 'demo.user@parkitnow.com',
        name: 'ParkItNow Demo User',
        role: 'user',
        password: 'Demo@123',
      },
      {
        email: 'demo.owner@parkitnow.com',
        name: 'ParkItNow Demo Owner',
        role: 'owner',
        password: 'Demo@123',
      },
      {
        email: 'demo.admin@parkitnow.com',
        name: 'ParkItNow Demo Admin',
        role: 'superAdmin',
        password: 'Demo@123',
      },
    ];

    let ownerUser = null;

    for (const u of usersToSeed) {
      let existingUser = await User.findOne({ email: u.email });
      if (existingUser) {
        existingUser.password = u.password;
        existingUser.name = u.name;
        existingUser.role = u.role;
        await existingUser.save();
        console.log(`Updated existing user: ${u.email}`);
        if (u.role === 'owner') ownerUser = existingUser;
      } else {
        const newUser = await User.create(u);
        console.log(`Created new user: ${u.email}`);
        if (u.role === 'owner') ownerUser = newUser;
      }
    }

    const allLotsToSeed = generateLotsArray();
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

      // Use findOneAndUpdate with upsert: true based on name and city
      const lotDoc = await ParkingLot.findOneAndUpdate(
        lotQuery,
        { $set: updateData },
        { upsert: true, new: true, runValidators: true }
      );

      // Link slots (seed 8 to 12 slots: we can seed exactly 10 slots)
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
    console.log(`total lot count after seed: ${lotsAfter}`);

    // City-wise count
    const cities = ['Gwalior', 'Indore', 'Bhopal', 'Jabalpur', 'Ujjain', 'Sagar', 'Rewa', 'Satna', 'Dewas', 'Ratlam'];
    for (const c of cities) {
      const count = await ParkingLot.countDocuments({ city: c.toLowerCase() });
      console.log(`- ${c}: ${count}`);
    }

    // EV charging enabled lot count
    const evEnabledCount = await ParkingLot.countDocuments({ 'evCharging.available': true });
    console.log(`EV charging enabled lot count: ${evEnabledCount}`);

    console.log(`number of slots created or already existing: ${totalSlotsCreatedOrUpdated}`);

    // Print sample pricing
    console.log('\n--- Sample Pricing Post-Seed ---');
    const samples = [
      'DB City Mall Parking',
      'Lashkar Market Parking',
      'Indore Premium Lot 1',
    ];
    for (const name of samples) {
      const lotDoc = await ParkingLot.findOne({ name });
      if (lotDoc) {
        console.log(`\n${lotDoc.name}:`);
        console.log(`  2-Wheeler: ₹${lotDoc.pricePerHourByVehicleCategory?.twoWheeler}/hr`);
        console.log(`  4-Wheeler: ₹${lotDoc.pricePerHourByVehicleCategory?.fourWheeler}/hr`);
        console.log(`  EV Charging: ${lotDoc.evCharging?.available ? `₹${lotDoc.evCharging.pricePerHour}/hr` : 'not available'}`);
      }
    }

    console.log('\nSeeding process completed successfully!');
  } catch (err) {
    console.error('Seeding process encountered an error:', err);
  } finally {
    console.log('Disconnecting database...');
    await mongoose.disconnect();
    console.log('Disconnected.');
  }
};

seedParkingData();
