import express from 'express';
import * as productController from '../controllers/productController';

const router = express.Router();

// Master
router.route('/')
  .get(productController.getProducts)
  .post(productController.createProduct);

router.route('/:id')
  .put(productController.updateProduct)
  .delete(productController.deleteProduct);

// Availability
router.route('/availability')
  .get(productController.availabilityController.get)
  .post(productController.availabilityController.create);
router.route('/availability/:id')
  .put(productController.availabilityController.update)
  .delete(productController.availabilityController.delete);

// Recommendation
router.route('/recommendations')
  .get(productController.recommendationController.get)
  .post(productController.recommendationController.create);
router.route('/recommendations/:id')
  .put(productController.recommendationController.update)
  .delete(productController.recommendationController.delete);

export default router;
