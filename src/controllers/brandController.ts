import { Request, Response } from 'express';
import Brand from '../models/Brand';

export const createBrand = async (req: Request, res: Response) => {
  try {
    if (Array.isArray(req.body)) {
      // Bulk creation
      const brands = await Brand.insertMany(req.body);
      res.status(201).json({ success: true, count: brands.length, data: brands });
    } else {
      // Single creation
      const brand = new Brand(req.body);
      const savedBrand = await brand.save();
      res.status(201).json({ success: true, data: savedBrand });
    }
  } catch (error) {
    res.status(400).json({ success: false, error: (error as Error).message });
  }
};

export const getBrandBySlug = async (req: Request, res: Response) => {
  try {
    const brand = await Brand.findOne({ slug: req.params.slug }).lean();
    if (!brand) {
      return res.status(404).json({ success: false, error: 'Brand not found' });
    }
    res.status(200).json({ success: true, data: brand });
  } catch (error) {
    res.status(400).json({ success: false, error: (error as Error).message });
  }
};

export const getAllBrands = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;
    
    // Build filter object
    const filter: any = {};
    
    if (req.query.is_active === 'true') {
      filter['status.is_active'] = true;
    }
    
    if (req.query.is_authorized === 'true') {
      filter['status.is_authorized_dealer'] = true;
    }
    
    if (req.query.featured === 'true') {
      filter.featured = true;
    }

    // Text search if provided
    if (req.query.search) {
      filter.$text = { $search: req.query.search as string };
    }

    const brands = await Brand.find(filter)
      .sort({ sort_order: 1, name: 1 }) // Sort by custom order, then name
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Brand.countDocuments(filter);

    res.status(200).json({ 
      success: true, 
      count: brands.length, 
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit)
      },
      data: brands 
    });
  } catch (error) {
    res.status(400).json({ success: false, error: (error as Error).message });
  }
};

export const updateBrand = async (req: Request, res: Response) => {
  try {
    const brand = await Brand.findOneAndUpdate(
      { slug: req.params.slug }, 
      req.body, 
      {
        new: true,
        runValidators: true,
      }
    );
    if (!brand) {
      return res.status(404).json({ success: false, error: 'Brand not found' });
    }
    res.status(200).json({ success: true, data: brand });
  } catch (error) {
    res.status(400).json({ success: false, error: (error as Error).message });
  }
};

export const deleteBrand = async (req: Request, res: Response) => {
  try {
    const brand = await Brand.findOneAndDelete({ slug: req.params.slug });
    if (!brand) {
      return res.status(404).json({ success: false, error: 'Brand not found' });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(400).json({ success: false, error: (error as Error).message });
  }
};

export const deleteBrands = async (req: Request, res: Response) => {
  try {
    const { slugs } = req.body;
    if (!slugs || !Array.isArray(slugs) || slugs.length === 0) {
      return res.status(400).json({ success: false, error: 'Please provide an array of slugs' });
    }
    await Brand.deleteMany({ slug: { $in: slugs } });
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(400).json({ success: false, error: (error as Error).message });
  }
};

export const toggleBrandStatus = async (req: Request, res: Response) => {
  try {
    const brand = await Brand.findOne({ slug: req.params.slug });
    if (!brand) {
      return res.status(404).json({ success: false, error: 'Brand not found' });
    }
    
    // Toggle active status
    brand.status.is_active = !brand.status.is_active;
    
    await brand.save();
    res.status(200).json({ success: true, data: brand });
  } catch (error) {
    res.status(400).json({ success: false, error: (error as Error).message });
  }
};
