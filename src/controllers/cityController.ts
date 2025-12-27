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
    const city = await City.findOne({ slug: req.params.slug }).lean();
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
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 1000;
    const skip = (page - 1) * limit;
    
    // Check if 'lite' mode is requested (e.g. for dropdowns)
    const isLite = req.query.lite === 'true';
    const projection = isLite 
      ? { name: 1, slug: 1, display_name: 1, state: 1, country: 1, is_active: 1, 'geo.coordinates': 1 } 
      : {};

    const cities = await City.find({}, projection)
      .skip(skip)
      .limit(limit)
      .lean(); // Performance: Return POJO instead of Mongoose Docs

    const total = await City.countDocuments({});

    res.status(200).json({ 
      success: true, 
      count: cities.length, 
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit)
      },
      data: cities 
    });
  } catch (error) {
    res.status(400).json({ success: false, error: (error as Error).message });
  }
};

export const updateCity = async (req: Request, res: Response) => {
  try {
    const city = await City.findOneAndUpdate({ slug: req.params.slug }, req.body, {
      new: true,
      runValidators: true,
    });
    if (!city) {
      return res.status(404).json({ success: false, error: 'City not found' });
    }
    res.status(200).json({ success: true, data: city });
  } catch (error) {
    res.status(400).json({ success: false, error: (error as Error).message });
  }
};

export const deleteCity = async (req: Request, res: Response) => {
  try {
    const city = await City.findOneAndDelete({ slug: req.params.slug });
    if (!city) {
      return res.status(404).json({ success: false, error: 'City not found' });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(400).json({ success: false, error: (error as Error).message });
  }
};

export const deleteCities = async (req: Request, res: Response) => {
  try {
    const { slugs } = req.body;
    if (!slugs || !Array.isArray(slugs) || slugs.length === 0) {
      return res.status(400).json({ success: false, error: 'Please provide an array of slugs' });
    }
    await City.deleteMany({ slug: { $in: slugs } });
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(400).json({ success: false, error: (error as Error).message });
  }
};
