import mongoose from 'mongoose';
import dotenv from 'dotenv';
import City from '../models/City';
import fs from 'fs';
import path from 'path';

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || '');
    console.log('MongoDB Connected for Seeding');

    const dataPath = path.join(__dirname, 'delhi.json');
    const cityData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

    // Check if city exists
    const existingCity = await City.findOne({ slug: cityData.slug });
    if (existingCity) {
        console.log(`City ${cityData.name} already exists. Updating...`);
        await City.findOneAndUpdate({ slug: cityData.slug }, cityData);
        console.log('City updated.');
    } else {
        await City.create(cityData);
        console.log(`City ${cityData.name} created.`);
    }

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedData();
