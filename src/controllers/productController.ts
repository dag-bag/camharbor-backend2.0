import { Request, Response } from 'express';
import Product from '../models/Product';
import ProductAvailability from '../models/ProductAvailability';
import ProductRecommendation from '../models/ProductRecommendation';

// === PRODUCT MASTER ===

export const createProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    res.status(400).json({ success: false, error: (error as Error).message });
  }
};

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find(req.query).lean();
    res.status(200).json({ success: true, count: products.length, data: products });
  } catch (error) {
    res.status(400).json({ success: false, error: (error as Error).message });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if(!product) return res.status(404).json({ success: false, error: 'Product not found' });
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(400).json({ success: false, error: (error as Error).message });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if(!product) return res.status(404).json({ success: false, error: 'Product not found' });
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(400).json({ success: false, error: (error as Error).message });
    }
};

// === SUB-MODELS ===

const subModelCRUD = (model: any) => ({
    get: async (req: Request, res: Response) => {
        try {
            const data = await model.find(req.query).lean();
            res.status(200).json({ success: true, count: data.length, data });
        } catch (e) { res.status(400).json({ success: false, error: (e as Error).message }); }
    },
    create: async (req: Request, res: Response) => {
        try {
            const item = await model.create(req.body);
            res.status(201).json({ success: true, data: item });
        } catch (e) { res.status(400).json({ success: false, error: (e as Error).message }); }
    },
    update: async (req: Request, res: Response) => {
        try {
            const item = await model.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if(!item) return res.status(404).json({ success: false, error: 'Item not found' });
            res.status(200).json({ success: true, data: item });
        } catch (e) { res.status(400).json({ success: false, error: (e as Error).message }); }
    },
    delete: async (req: Request, res: Response) => {
        try {
            const item = await model.findByIdAndDelete(req.params.id);
            if(!item) return res.status(404).json({ success: false, error: 'Item not found' });
            res.status(200).json({ success: true, data: {} });
        } catch (e) { res.status(400).json({ success: false, error: (e as Error).message }); }
    }
});

export const availabilityController = subModelCRUD(ProductAvailability);
export const recommendationController = subModelCRUD(ProductRecommendation);
