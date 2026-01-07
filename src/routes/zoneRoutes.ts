import express from 'express';
import {
  createZone,
  getAllZones,
  getZoneBySlug,
  updateZone,
  deleteZone,
  getZonesByCity
} from '../controllers/zoneController';

const router = express.Router();

router.post('/', createZone);
router.get('/', getAllZones);
router.get('/city/:citySlugOrId', getZonesByCity); // Special route for resolving by city slug/id
router.get('/:slug', getZoneBySlug);
router.put('/:id', updateZone); // Note: using ID for update
router.delete('/:id', deleteZone); // Note: using ID for delete

export default router;
