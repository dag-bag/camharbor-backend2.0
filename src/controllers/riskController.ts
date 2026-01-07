import { Request, Response } from 'express';
import CrimeStat from '../models/CrimeStat';
import RiskProfile from '../models/RiskProfile';
import RiskParameter from '../models/RiskParameter';

const genericCRUD = (model: any) => ({
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

export const crimeStatController = genericCRUD(CrimeStat);
export const riskProfileController = genericCRUD(RiskProfile);
export const riskParameterController = genericCRUD(RiskParameter);
