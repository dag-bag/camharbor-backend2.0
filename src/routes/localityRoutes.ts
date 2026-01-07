import express from 'express';
import * as localityController from '../controllers/localityController';

const router = express.Router();

router.route('/')
  .post(localityController.createLocality)
  .get(localityController.getLocalities);

router.route('/:id')
  .get(localityController.getLocalityById)
  .put(localityController.updateLocality)
  .delete(localityController.deleteLocality);

export default router;
