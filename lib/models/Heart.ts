import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * Heart interface for TypeScript
 */
export interface IHeart extends Document {
  _id: string;
  user: mongoose.Types.ObjectId;
  post: mongoose.Types.ObjectId;
  createdAt: Date;
}

/**
 * Heart schema definition
 */
const HeartSchema: Schema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  post: {
    type: Schema.Types.ObjectId,
    ref: 'Post',
    required: true,
  },
}, {
  timestamps: true,
});

// Compound index to prevent duplicate hearts
HeartSchema.index({ user: 1, post: 1 }, { unique: true });

const Heart: Model<IHeart> = mongoose.models.Heart || mongoose.model<IHeart>('Heart', HeartSchema);

export default Heart;