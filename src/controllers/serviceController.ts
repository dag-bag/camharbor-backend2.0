import { Request, Response } from 'express';
import Service from '../models/Service';
import ServiceCoverage from '../models/ServiceCoverage';
import ServicePricing from '../models/ServicePricing';
import ServiceContent from '../models/ServiceContent';

// === SERVICE MASTER ===

export const createService = async (req: Request, res: Response) => {
  try {
    const service = await Service.create(req.body);
    res.status(201).json({ success: true, data: service });
  } catch (error) {
    res.status(400).json({ success: false, error: (error as Error).message });
  }
};

export const getServices = async (req: Request, res: Response) => {
  try {
    const services = await Service.find(req.query).lean();
    res.status(200).json({ success: true, count: services.length, data: services });
  } catch (error) {
    res.status(400).json({ success: false, error: (error as Error).message });
  }
};

export const updateService = async (req: Request, res: Response) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if(!service) return res.status(404).json({ success: false, error: 'Service not found' });
    res.status(200).json({ success: true, data: service });
  } catch (error) {
    res.status(400).json({ success: false, error: (error as Error).message });
  }
};

export const deleteService = async (req: Request, res: Response) => {
    try {
        const service = await Service.findByIdAndDelete(req.params.id);
        if(!service) return res.status(404).json({ success: false, error: 'Service not found' });
        // TODO: Delete related coverage, content, etc?
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(400).json({ success: false, error: (error as Error).message });
    }
};

// === SUB-MODELS (Generic Handler for Coverage, Pricing, Content) ===

const getSubModel = (model: any) => async (req: Request, res: Response) => {
    try {
        const query = { ...req.query };
        const data = await model.find(query).lean();
        res.status(200).json({ success: true, count: data.length, data });
    } catch (error) {
        res.status(400).json({ success: false, error: (error as Error).message });
    }
};

const createSubModel = (model: any) => async (req: Request, res: Response) => {
    try {
        const item = await model.create(req.body);
        res.status(201).json({ success: true, data: item });
    } catch (error) {
        res.status(400).json({ success: false, error: (error as Error).message });
    }
};

const updateSubModel = (model: any) => async (req: Request, res: Response) => {
    try {
        const item = await model.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if(!item) return res.status(404).json({ success: false, error: 'Item not found' });
        res.status(200).json({ success: true, data: item });
    } catch (error) {
        res.status(400).json({ success: false, error: (error as Error).message });
    }
};

const deleteSubModel = (model: any) => async (req: Request, res: Response) => {
    try {
        const item = await model.findByIdAndDelete(req.params.id);
        if(!item) return res.status(404).json({ success: false, error: 'Item not found' });
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(400).json({ success: false, error: (error as Error).message });
    }
};

// Exports for Sub-models
export const getServiceCoverage = getSubModel(ServiceCoverage);
export const createServiceCoverage = createSubModel(ServiceCoverage);
export const updateServiceCoverage = updateSubModel(ServiceCoverage);
export const deleteServiceCoverage = deleteSubModel(ServiceCoverage);

export const getServicePricing = getSubModel(ServicePricing);
export const createServicePricing = createSubModel(ServicePricing);
export const updateServicePricing = updateSubModel(ServicePricing);
export const deleteServicePricing = deleteSubModel(ServicePricing);

export const getServiceContent = getSubModel(ServiceContent);
export const createServiceContent = createSubModel(ServiceContent);
export const updateServiceContent = updateSubModel(ServiceContent);
export const deleteServiceContent = deleteSubModel(ServiceContent);
