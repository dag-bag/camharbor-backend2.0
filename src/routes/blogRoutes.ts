import express from 'express';
import { 
  createBlog, 
  getBlogBySlug, 
  getAllBlogs, 
  updateBlog, 
  deleteBlog, 
  deleteBlogs,
  toggleBlogStatus 
} from '../controllers/blogController';

const router = express.Router();

/**
 * @swagger
 * /blogs:
 *   post:
 *     summary: Create one or multiple blogs
 *     tags: [Blogs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             oneOf:
 *               - $ref: '#/components/schemas/Blog'
 *               - type: array
 *                 items:
 *                   $ref: '#/components/schemas/Blog'
 *     responses:
 *       201:
 *         description: The created blog or blogs
 *       400:
 *         description: Bad request
 */
router.post('/', createBlog);

/**
 * @swagger
 * /blogs:
 *   delete:
 *     summary: Delete multiple blogs by slug
 *     tags: [Blogs]
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
 *         description: Blogs deleted successfully
 *       400:
 *         description: Bad request
 */
router.delete('/', deleteBlogs);

/**
 * @swagger
 * /blogs:
 *   get:
 *     summary: Get all blogs with optional filtering
 *     tags: [Blogs]
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
 *         name: status
 *         schema:
 *           type: string
 *           enum: [draft, published, archived]
 *         description: Filter by status
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *       - in: query
 *         name: featured
 *         schema:
 *           type: boolean
 *         description: Filter featured blogs
 *       - in: query
 *         name: author
 *         schema:
 *           type: string
 *         description: Filter by author
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Full-text search across title, content, tags, author, category
 *     responses:
 *       200:
 *         description: List of all blogs
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
 *                     $ref: '#/components/schemas/Blog'
 *       400:
 *         description: Bad request
 */
router.get('/', getAllBlogs);

/**
 * @swagger
 * /blogs/{slug}:
 *   get:
 *     summary: Get a blog by slug
 *     tags: [Blogs]
 *     parameters:
 *       - in: path
 *         name: slug
 *         schema:
 *           type: string
 *         required: true
 *         description: The blog slug
 *     responses:
 *       200:
 *         description: The blog description by slug
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Blog'
 *       404:
 *         description: Blog not found
 */
router.get('/:slug', getBlogBySlug);

/**
 * @swagger
 * /blogs/{slug}:
 *   put:
 *     summary: Update a blog by slug
 *     tags: [Blogs]
 *     parameters:
 *       - in: path
 *         name: slug
 *         schema:
 *           type: string
 *         required: true
 *         description: The blog slug
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Blog'
 *     responses:
 *       200:
 *         description: The updated blog
 *       404:
 *         description: Blog not found
 */
router.put('/:slug', updateBlog);

/**
 * @swagger
 * /blogs/{slug}/toggle-status:
 *   patch:
 *     summary: Toggle blog status between draft and published
 *     tags: [Blogs]
 *     parameters:
 *       - in: path
 *         name: slug
 *         schema:
 *           type: string
 *         required: true
 *         description: The blog slug
 *     responses:
 *       200:
 *         description: Blog status toggled successfully
 *       404:
 *         description: Blog not found
 */
router.patch('/:slug/toggle-status', toggleBlogStatus);

/**
 * @swagger
 * /blogs/{slug}:
 *   delete:
 *     summary: Delete a blog by slug
 *     tags: [Blogs]
 *     parameters:
 *       - in: path
 *         name: slug
 *         schema:
 *           type: string
 *         required: true
 *         description: The blog slug
 *     responses:
 *       200:
 *         description: The blog was deleted
 *       404:
 *         description: Blog not found
 */
router.delete('/:slug', deleteBlog);

export default router;
