import express from 'express';
import * as riskController from '../controllers/riskController';

const router = express.Router();

// Crime Stats
router.route('/stats')
  .get(riskController.crimeStatController.get)
  .post(riskController.crimeStatController.create);
router.route('/stats/:id')
  .put(riskController.crimeStatController.update)
  .delete(riskController.crimeStatController.delete);

// Risk Profiles
router.route('/profiles')
  .get(riskController.riskProfileController.get)
  .post(riskController.riskProfileController.create);
router.route('/profiles/:id')
  .put(riskController.riskProfileController.update)
  .delete(riskController.riskProfileController.delete);

// Risk Parameters (Config)
router.route('/parameters')
  .get(riskController.riskParameterController.get)
  .post(riskController.riskParameterController.create);
router.route('/parameters/:id')
  .put(riskController.riskParameterController.update)
  .delete(riskController.riskParameterController.delete);

export default router;
