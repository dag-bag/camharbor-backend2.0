import { Request, Response } from 'express';
import Blog from '../models/Blog';

// Helper function to calculate reading time (rough estimate: 200 words per minute)
const calculateReadingTime = (content: string): number => {
  const wordsPerMinute = 200;
  const wordCount = content.trim().split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
};

export const createBlog = async (req: Request, res: Response) => {
  try {
    if (Array.isArray(req.body)) {
      // Bulk creation - calculate reading time for each
      const blogsWithReadingTime = req.body.map(blog => ({
        ...blog,
        reading_time: blog.reading_time || calculateReadingTime(blog.content || '')
      }));
      const blogs = await Blog.insertMany(blogsWithReadingTime);
      res.status(201).json({ success: true, count: blogs.length, data: blogs });
    } else {
      // Single creation
      const blogData = {
        ...req.body,
        reading_time: req.body.reading_time || calculateReadingTime(req.body.content || '')
      };
      const blog = new Blog(blogData);
      const savedBlog = await blog.save();
      res.status(201).json({ success: true, data: savedBlog });
    }
  } catch (error) {
    res.status(400).json({ success: false, error: (error as Error).message });
  }
};

export const getBlogBySlug = async (req: Request, res: Response) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug }).lean();
    if (!blog) {
      return res.status(404).json({ success: false, error: 'Blog not found' });
    }
    res.status(200).json({ success: true, data: blog });
  } catch (error) {
    res.status(400).json({ success: false, error: (error as Error).message });
  }
};

export const getAllBlogs = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;
    
    // Build filter object
    const filter: any = {};
    
    if (req.query.status) {
      filter.status = req.query.status;
    }
    
    if (req.query.category) {
      filter.category = req.query.category;
    }
    
    if (req.query.featured === 'true') {
      filter.is_featured = true;
    }
    
    if (req.query.author) {
      filter.author = req.query.author;
    }

    // Text search if provided
    if (req.query.search) {
      filter.$text = { $search: req.query.search as string };
    }

    const blogs = await Blog.find(filter)
      .sort({ createdAt: -1 }) // Most recent first
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Blog.countDocuments(filter);

    res.status(200).json({ 
      success: true, 
      count: blogs.length, 
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit)
      },
      data: blogs 
    });
  } catch (error) {
    res.status(400).json({ success: false, error: (error as Error).message });
  }
};

export const updateBlog = async (req: Request, res: Response) => {
  try {
    // Recalculate reading time if content is being updated
    const updateData = {
      ...req.body,
      ...(req.body.content && {
        reading_time: req.body.reading_time || calculateReadingTime(req.body.content)
      })
    };

    const blog = await Blog.findOneAndUpdate(
      { slug: req.params.slug }, 
      updateData, 
      {
        new: true,
        runValidators: true,
      }
    );
    if (!blog) {
      return res.status(404).json({ success: false, error: 'Blog not found' });
    }
    res.status(200).json({ success: true, data: blog });
  } catch (error) {
    res.status(400).json({ success: false, error: (error as Error).message });
  }
};

export const deleteBlog = async (req: Request, res: Response) => {
  try {
    const blog = await Blog.findOneAndDelete({ slug: req.params.slug });
    if (!blog) {
      return res.status(404).json({ success: false, error: 'Blog not found' });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(400).json({ success: false, error: (error as Error).message });
  }
};

export const deleteBlogs = async (req: Request, res: Response) => {
  try {
    const { slugs } = req.body;
    if (!slugs || !Array.isArray(slugs) || slugs.length === 0) {
      return res.status(400).json({ success: false, error: 'Please provide an array of slugs' });
    }
    await Blog.deleteMany({ slug: { $in: slugs } });
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(400).json({ success: false, error: (error as Error).message });
  }
};

export const toggleBlogStatus = async (req: Request, res: Response) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug });
    if (!blog) {
      return res.status(404).json({ success: false, error: 'Blog not found' });
    }
    
    // Toggle between draft and published
    blog.status = blog.status === 'published' ? 'draft' : 'published';
    
    // Set published_at if publishing for the first time
    if (blog.status === 'published' && !blog.published_at) {
      blog.published_at = new Date();
    }
    
    await blog.save();
    res.status(200).json({ success: true, data: blog });
  } catch (error) {
    res.status(400).json({ success: false, error: (error as Error).message });
  }
};
