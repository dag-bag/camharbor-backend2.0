import { Request, Response } from 'express';
import Locality from '../models/Locality';
import City from '../models/City';
import Zone from '../models/Zone';

export const createLocality = async (req: Request, res: Response) => {
  try {
    const payload = req.body;

    // Helper to validate and enrich
    const processLocality = async (data: any) => {
        // Validate City
        if (data.city_id) {
           const city = await City.findById(data.city_id);
           if (!city) throw new Error(`Invalid city_id: ${data.city_id}`);
        }
        // Validate Zone if present
        if (data.zone_id) {
            const zone = await Zone.findById(data.zone_id);
            if (!zone) throw new Error(`Invalid zone_id: ${data.zone_id}`);
        }
        return data;
    };

    if (Array.isArray(payload)) {
        const processed = await Promise.all(payload.map(item => processLocality(item)));
        const localities = await Locality.insertMany(processed);
        res.status(201).json({ success: true, count: localities.length, data: localities });
    } else {
        await processLocality(payload);
        const locality = new Locality(payload);
        const saved = await locality.save();
        res.status(201).json({ success: true, data: saved });
    }
  } catch (error) {
    res.status(400).json({ success: false, error: (error as Error).message });
  }
};

export const getLocalities = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 100;
    const skip = (page - 1) * limit;

    const query: any = {};
    if (req.query.city_id) query.city_id = req.query.city_id;
    if (req.query.zone_id) query.zone_id = req.query.zone_id;
    if (req.query.q) {
        query.name = { $regex: req.query.q, $options: 'i' };
    }

    const localities = await Locality.find(query)
      .populate('city_id', 'name slug')
      .populate('zone_id', 'name slug')
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Locality.countDocuments(query);

    res.status(200).json({ 
      success: true, 
      count: localities.length,
      pagination: { total, page, pages: Math.ceil(total / limit) },
      data: localities 
    });
  } catch (error) {
    res.status(400).json({ success: false, error: (error as Error).message });
  }
};

export const getLocalityById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const locality = await Locality.findById(id).populate('city_id').populate('zone_id').lean();
        if (!locality) return res.status(404).json({ success: false, error: 'Locality not found' });
        res.status(200).json({ success: true, data: locality });
    } catch (error) {
        res.status(400).json({ success: false, error: (error as Error).message });
    }
};

export const updateLocality = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const locality = await Locality.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
        if (!locality) return res.status(404).json({ success: false, error: 'Locality not found' });
        res.status(200).json({ success: true, data: locality });
    } catch (error) {
        res.status(400).json({ success: false, error: (error as Error).message });
    }
};

export const deleteLocality = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const locality = await Locality.findByIdAndDelete(id);
        if (!locality) return res.status(404).json({ success: false, error: 'Locality not found' });
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(400).json({ success: false, error: (error as Error).message });
    }
};
