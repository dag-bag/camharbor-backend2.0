import { Request, Response } from 'express';
import Zone from '../models/Zone';
import City from '../models/City';

export const createZone = async (req: Request, res: Response) => {
  try {
    const payload = req.body;

    // Helper to process a single zone object
    const processZoneData = async (data: any) => {
        if (data.city_id && !data.city_name) {
             const city = await City.findById(data.city_id);
             if (city) {
                 data.city_name = city.name;
                 // Optional: Auto-fill geo lat/lng from city if missing in zone?
                 // No, zone should be specific.
             }
        }
        return data;
    };

    if (Array.isArray(payload)) {
        // Bulk Creation
        const processed = await Promise.all(payload.map(item => processZoneData(item)));
        const zones = await Zone.insertMany(processed);
        res.status(201).json({ success: true, count: zones.length, data: zones });
    } else {
        // Single Creation
        await processZoneData(payload);
        const zone = new Zone(payload);
        const savedZone = await zone.save();
        res.status(201).json({ success: true, data: savedZone });
    }
  } catch (error) {
    res.status(400).json({ success: false, error: (error as Error).message });
  }
};

export const getZoneBySlug = async (req: Request, res: Response) => {
  try {
    const zone = await Zone.findOne({ slug: req.params.slug }).lean();
    if (!zone) {
      return res.status(404).json({ success: false, error: 'Zone not found' });
    }
    res.status(200).json({ success: true, data: zone });
  } catch (error) {
    res.status(400).json({ success: false, error: (error as Error).message });
  }
};

export const getAllZones = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 1000;
    const skip = (page - 1) * limit;

    const query: any = {};
    if (req.query.city_id) {
        query.city_id = req.query.city_id;
    }

    const zones = await Zone.find(query)
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Zone.countDocuments(query);

    res.status(200).json({ 
      success: true, 
      count: zones.length, 
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit)
      },
      data: zones 
    });
  } catch (error) {
    res.status(400).json({ success: false, error: (error as Error).message });
  }
};

export const getZonesByCity = async (req: Request, res: Response) => {
    try {
        const { citySlugOrId } = req.params;
        let city;
        
        // Check if ID or Slug
        if (citySlugOrId.match(/^[0-9a-fA-F]{24}$/)) {
            city = await City.findById(citySlugOrId);
        } else {
            city = await City.findOne({ slug: citySlugOrId });
        }

        if (!city) {
             return res.status(404).json({ success: false, error: 'City not found' });
        }

        const zones = await Zone.find({ city_id: city._id }).lean();
         res.status(200).json({ success: true, count: zones.length, data: zones });

    } catch (error) {
        res.status(400).json({ success: false, error: (error as Error).message });
    }
}

export const updateZone = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // Using ID for updates as slug might change
    // If param is a slug, find by slug. If ID, find by ID.
    // Standard practice here seems to be slug or ID? 
    // The previous dashboard code for city used slug.
    // The ZoneForm uses ID for updateZone in my implementation `zoneApi.updateZone(formData._id...)`
    // Wait, the API route definition will determine this. 
    // Let's assume ID for now as that is safer for renames.
    
    // Check if valid ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
         return res.status(400).json({ success: false, error: 'Invalid ID format' });
    }

    const zone = await Zone.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!zone) {
      return res.status(404).json({ success: false, error: 'Zone not found' });
    }
    res.status(200).json({ success: true, data: zone });
  } catch (error) {
    res.status(400).json({ success: false, error: (error as Error).message });
  }
};

export const deleteZone = async (req: Request, res: Response) => {
  try {
     const { id } = req.params;
    const zone = await Zone.findByIdAndDelete(id);
    if (!zone) {
      return res.status(404).json({ success: false, error: 'Zone not found' });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(400).json({ success: false, error: (error as Error).message });
  }
};
