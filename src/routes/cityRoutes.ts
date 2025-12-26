import express from 'express';
import { createCity, getCityBySlug, getAllCities } from '../controllers/cityController';

const router = express.Router();

router.post('/', createCity);
router.get('/', getAllCities);
router.get('/:slug', getCityBySlug);

export default router;
