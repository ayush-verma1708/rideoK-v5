import mongoose from 'mongoose';

const { Schema } = mongoose;

const feedbackSchema = new Schema(
  {
    // userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    user:{type:String},
    rating: { type: Number, required: true, min: 1, max: 5 },
    comments: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Feedback = mongoose.model('Feedback', feedbackSchema);

export default Feedback;
