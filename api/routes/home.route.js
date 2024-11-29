import express from 'express';
import { getRandomPosts } from '../controllers/home.controller.js';

const router = express.Router();

/**
 * @route   GET /api/posts/random
 * @desc    Get random posts (limit 9)
 */
router.get('/random', getRandomPosts);

export default router;
