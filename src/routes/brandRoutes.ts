import express from 'express';
import { 
  createBrand, 
  getBrandBySlug, 
  getAllBrands, 
  updateBrand, 
  deleteBrand, 
  deleteBrands,
  toggleBrandStatus 
} from '../controllers/brandController';

const router = express.Router();

/**
 * @swagger
 * /brands:
 *   post:
 *     summary: Create one or multiple brands
 *     tags: [Brands]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             oneOf:
 *               - $ref: '#/components/schemas/Brand'
 *               - type: array
 *                 items:
 *                   $ref: '#/components/schemas/Brand'
 *     responses:
 *       201:
 *         description: The created brand or brands
 *       400:
 *         description: Bad request
 */
router.post('/', createBrand);

/**
 * @swagger
 * /brands:
 *   delete:
 *     summary: Delete multiple brands by slug
 *     tags: [Brands]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               slugs:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Brands deleted successfully
 *       400:
 *         description: Bad request
 */
router.delete('/', deleteBrands);

/**
 * @swagger
 * /brands:
 *   get:
 *     summary: Get all brands with optional filtering
 *     tags: [Brands]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *       - in: query
 *         name: is_active
 *         schema:
 *           type: boolean
 *         description: Filter active brands
 *       - in: query
 *         name: is_authorized
 *         schema:
 *           type: boolean
 *         description: Filter authorized dealers
 *       - in: query
 *         name: featured
 *         schema:
 *           type: boolean
 *         description: Filter featured brands
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Full-text search across name, description, and resource titles
 *     responses:
 *       200:
 *         description: List of all brands
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     pages:
 *                       type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Brand'
 *       400:
 *         description: Bad request
 */
router.get('/', getAllBrands);

/**
 * @swagger
 * /brands/{slug}:
 *   get:
 *     summary: Get a brand by slug
 *     tags: [Brands]
 *     parameters:
 *       - in: path
 *         name: slug
 *         schema:
 *           type: string
 *         required: true
 *         description: The brand slug
 *     responses:
 *       200:
 *         description: The brand description by slug
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Brand'
 *       404:
 *         description: Brand not found
 */
router.get('/:slug', getBrandBySlug);

/**
 * @swagger
 * /brands/{slug}:
 *   put:
 *     summary: Update a brand by slug
 *     tags: [Brands]
 *     parameters:
 *       - in: path
 *         name: slug
 *         schema:
 *           type: string
 *         required: true
 *         description: The brand slug
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Brand'
 *     responses:
 *       200:
 *         description: The updated brand
 *       404:
 *         description: Brand not found
 */
router.put('/:slug', updateBrand);

/**
 * @swagger
 * /brands/{slug}/toggle-status:
 *   patch:
 *     summary: Toggle brand active status
 *     tags: [Brands]
 *     parameters:
 *       - in: path
 *         name: slug
 *         schema:
 *           type: string
 *         required: true
 *         description: The brand slug
 *     responses:
 *       200:
 *         description: Brand status toggled successfully
 *       404:
 *         description: Brand not found
 */
router.patch('/:slug/toggle-status', toggleBrandStatus);

/**
 * @swagger
 * /brands/{slug}:
 *   delete:
 *     summary: Delete a brand by slug
 *     tags: [Brands]
 *     parameters:
 *       - in: path
 *         name: slug
 *         schema:
 *           type: string
 *         required: true
 *         description: The brand slug
 *     responses:
 *       200:
 *         description: The brand was deleted
 *       404:
 *         description: Brand not found
 */
router.delete('/:slug', deleteBrand);

export default router;
