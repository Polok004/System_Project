import express from 'express';
import { getRandomPosts,getRandomAgents,getLatestBlogs } from '../controllers/home.controller.js';

const router = express.Router();

/**
 * @route   GET /api/posts/random
 * @desc    Get random posts (limit 9)
 */
router.get('/random', getRandomPosts);
router.get('/randomAgents', getRandomAgents);
router.get('/latestBlog', getLatestBlogs)

export default router;
