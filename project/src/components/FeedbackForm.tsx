import React, { useState, FormEvent } from 'react';
import axios from 'axios';

interface FeedbackFormProps {}

const FeedbackForm: React.FC<FeedbackFormProps> = () => {
  const [user, setUser] = useState<string>(''); 
  const [rating, setRating] = useState<number>(1); 
  const [comments, setComments] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [showModal, setShowModal] = useState<boolean>(false); // To toggle modal visibility

  // Handle feedback submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    // Construct feedback data
    const feedbackData = {
      user,
      rating,
      comments,
    };

    try {
      // Make API call to submit feedback
      await axios.post('https://rideok-v5.onrender.com/api/feedback', feedbackData);

      // On success
      setSuccessMessage('Thank you for your feedback!');
      setTimeout(() => {
        setShowModal(false);  // Close modal after successful submission
      }, 2000);
    } catch (error) {
      // On error
      setErrorMessage('Failed to submit feedback. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="feedback-form">
      <button
        onClick={() => setShowModal(true)}
        className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
      >
        Submit Feedback
      </button>

      {/* Modal */}
      {showModal && (
        <div
          className="modal-overlay fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50"
          onClick={() => setShowModal(false)} // Close modal when clicking outside the modal
        >
          <div
            className="modal-content bg-white p-6 rounded-md shadow-lg max-w-md w-full"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal content
          >
            <h2 className="text-xl font-semibold mb-4">Submit Your Feedback</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Your Name</label>
                <input
                  type="text"
                  value={user}
                  onChange={(e) => setUser(e.target.value)}
                  className="block w-full px-4 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Rating</label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`cursor-pointer text-2xl ${
                        star <= rating ? 'text-yellow-500' : 'text-gray-300'
                      }`}
                      onClick={() => setRating(star)}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Comments</label>
                <textarea
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  className="block w-full px-4 py-2 border border-gray-300 rounded-md"
                  placeholder="Your feedback"
                  rows={4}
                  required
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Submitting...' : 'Submit Feedback'}
                </button>
              </div>
            </form>

            {successMessage && <p className="mt-4 text-green-500">{successMessage}</p>}
            {errorMessage && <p className="mt-4 text-red-500">{errorMessage}</p>}

            {/* Close button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedbackForm;
