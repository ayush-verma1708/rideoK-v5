import express from 'express';
import { submitFeedback } from '../controller/feedbackController.js';

const router = express.Router();

// POST route to submit feedback
router.post('/feedback', submitFeedback);

export default router;
