import { Request, Response } from 'express';
import City from '../models/City';

export const createCity = async (req: Request, res: Response) => {
  try {
    if (Array.isArray(req.body)) {
      const cities = await City.insertMany(req.body);
      res.status(201).json({ success: true, count: cities.length, data: cities });
    } else {
      const city = new City(req.body);
      const savedCity = await city.save();
      res.status(201).json({ success: true, data: savedCity });
    }
  } catch (error) {
    res.status(400).json({ success: false, error: (error as Error).message });
  }
};

export const getCityBySlug = async (req: Request, res: Response) => {
  try {
    const city = await City.findOne({ slug: req.params.slug });
    if (!city) {
      return res.status(404).json({ success: false, error: 'City not found' });
    }
    res.status(200).json({ success: true, data: city });
  } catch (error) {
    res.status(400).json({ success: false, error: (error as Error).message });
  }
};

export const getAllCities = async (req: Request, res: Response) => {
  try {
    const cities = await City.find({ is_active: true });
    res.status(200).json({ success: true, count: cities.length, data: cities });
  } catch (error) {
    res.status(400).json({ success: false, error: (error as Error).message });
  }
};
