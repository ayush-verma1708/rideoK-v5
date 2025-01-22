import Feedback from '../models/feedbackModel.js';

export const submitFeedback = async (req, res) => {
  try {
    const { user, rating, comments } = req.body;

    // Validate that all required fields are provided
    if (!user || !rating || !comments) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Validate that the rating is within the acceptable range
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    // Create a new feedback object
    const newFeedback = new Feedback({
      user,
      rating,
      comments,
    });

    // Save the feedback to the database
    await newFeedback.save();

    // Respond with the feedback data
    return res.status(201).json({
      message: 'Feedback submitted successfully',
      feedback: newFeedback,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
