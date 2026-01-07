import express from 'express';
import * as serviceController from '../controllers/serviceController';

const router = express.Router();

// Master Service
router.route('/')
  .get(serviceController.getServices)
  .post(serviceController.createService);

router.route('/:id')
  .put(serviceController.updateService)
  .delete(serviceController.deleteService);

// Coverage
router.route('/coverage')
  .get(serviceController.getServiceCoverage)
  .post(serviceController.createServiceCoverage);
router.route('/coverage/:id')
  .put(serviceController.updateServiceCoverage)
  .delete(serviceController.deleteServiceCoverage);

// Pricing
router.route('/pricing')
  .get(serviceController.getServicePricing)
  .post(serviceController.createServicePricing);
router.route('/pricing/:id')
  .put(serviceController.updateServicePricing)
  .delete(serviceController.deleteServicePricing);

// Content
router.route('/content')
  .get(serviceController.getServiceContent)
  .post(serviceController.createServiceContent);
router.route('/content/:id')
  .put(serviceController.updateServiceContent)
  .delete(serviceController.deleteServiceContent);

export default router;
