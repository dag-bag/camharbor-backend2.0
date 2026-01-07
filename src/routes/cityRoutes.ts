import express from 'express';
import { createCity, getCityBySlug, getAllCities, updateCity, deleteCity, deleteCities, getActiveCities } from '../controllers/cityController';

const router = express.Router();

/**
 * @swagger
 * /cities:
 *   post:
 *     summary: Create one or multiple cities
 *     tags: [Cities]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             oneOf:
 *               - $ref: '#/components/schemas/City'
 *               - type: array
 *                 items:
 *                   $ref: '#/components/schemas/City'
 *     responses:
 *       201:
 *         description: The created city or cities
 *       400:
 *         description: Bad request
 */
router.post('/', createCity);

/**
 * @swagger
 * /cities:
 *   delete:
 *     summary: Delete multiple cities by slug
 *     tags: [Cities]
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
 *         description: Cities deleted successfully
 *       400:
 *         description: Bad request
 */
router.delete('/', deleteCities);

/**
 * @swagger
 * /cities:
 *   get:
 *     summary: Get all cities
 *     tags: [Cities]
 *     responses:
 *       200:
 *         description: List of all cities
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/City'
 *       400:
 *         description: Bad request
 */
router.get('/', getAllCities);

/**
 * @swagger
 * /cities/active:
 *   get:
 *     summary: Get all active cities
 *     tags: [Cities]
 *     responses:
 *       200:
 *         description: List of active cities
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/City'
 */
router.get('/active', getActiveCities);

/**
 * @swagger
 * /cities/{slug}:
 *   get:
 *     summary: Get a city by slug
 *     tags: [Cities]
 *     parameters:
 *       - in: path
 *         name: slug
 *         schema:
 *           type: string
 *         required: true
 *         description: The city slug
 *     responses:
 *       200:
 *         description: The city description by slug
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/City'
 *       404:
 *         description: City not found
 */
router.get('/:slug', getCityBySlug);

/**
 * @swagger
 * /cities/{slug}:
 *   put:
 *     summary: Update a city by slug
 *     tags: [Cities]
 *     parameters:
 *       - in: path
 *         name: slug
 *         schema:
 *           type: string
 *         required: true
 *         description: The city slug
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/City'
 *     responses:
 *       200:
 *         description: The updated city
 *       404:
 *         description: City not found
 */
router.put('/:slug', updateCity);

/**
 * @swagger
 * /cities/{slug}:
 *   delete:
 *     summary: Delete a city by slug
 *     tags: [Cities]
 *     parameters:
 *       - in: path
 *         name: slug
 *         schema:
 *           type: string
 *         required: true
 *         description: The city slug
 *     responses:
 *       200:
 *         description: The city was deleted
 *       404:
 *         description: City not found
 */
router.delete('/:slug', deleteCity);

export default router;
