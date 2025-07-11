import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * User interface for TypeScript
 */
export interface IUser extends Document {
  _id: string;
  email: string;
  name: string;
  image?: string;
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
  postsCount: number;
  heartsReceived: number;
}

/**
 * User schema definition
 */
const UserSchema: Schema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  image: {
    type: String,
    default: function(this: IUser) {
      // Default profile pictures based on gender (simple random assignment)
      const maleAvatar = 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150';
      const femaleAvatar = 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150';
      return Math.random() > 0.5 ? maleAvatar : femaleAvatar;
    },
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  lastLogin: {
    type: Date,
    default: Date.now,
  },
  postsCount: {
    type: Number,
    default: 0,
  },
  heartsReceived: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

// Indexes for better query performance
UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;