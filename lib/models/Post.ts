import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * Post interface for TypeScript
 */
export interface IPost extends Document {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  coverImage?: string;
  coverImagePublicId?: string;
  author: mongoose.Types.ObjectId;
  status: 'pending' | 'published' | 'rejected';
  readingTime: number;
  hearts: number;
  comments: Array<{
    author: mongoose.Types.ObjectId;
    content: string;
    createdAt: Date;
  }>;
  rejectionReason?: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

/**
 * Post schema definition
 */
const PostSchema = new Schema<IPost>({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  slug: {
    type: String,
    required: true,
    unique: true,      // inline unique index
    lowercase: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
    maxlength: 50000,  // ~5000 words
  },
  excerpt: {
    type: String,
    maxlength: 50000,
  },
  coverImage: {
    type: String,
    default:
      'https://images.pexels.com/photos/1261728/pexels-photo-1261728.jpeg' +
      '?auto=compress&cs=tinysrgb&w=800',
  },
  coverImagePublicId: {
    type: String,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'published', 'rejected'],
    default: 'pending',
  },
  readingTime: {
    type: Number,
    default: 1,
  },
  hearts: {
    type: Number,
    default: 0,
  },
  comments: [
    {
      author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      content: {
        type: String,
        required: true,
        maxlength: 500,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  rejectionReason: {
    type: String,
    maxlength: 500,
  },
  tags: [
    {
      type: String,
      trim: true,
    },
  ],
  publishedAt: {
    type: Date,
  },
}, {
  timestamps: true,
});

/**
 * Other indexes for performance
 */
PostSchema.index({ author: 1 });
PostSchema.index({ status: 1 });
PostSchema.index({ publishedAt: -1 });
PostSchema.index({ hearts: -1 });

/**
 * Calculate reading time based on content
 */
PostSchema.methods.calculateReadingTime = function (): number {
  const wordsPerMinute = 200;
  const text = this.content || '';
  
  // count words
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  
  // count markdown images (![alt](url))
  const imageMatches = text.match(/!\[.*?\]\(.*?\)/g);
  const imageCount = Array.isArray(imageMatches) ? imageMatches.length : 0;
  
  // each image adds ~0.5 minutes (30 seconds)
  const imageTime = imageCount * 0.5;
  
  // total minutes, rounded up
  return Math.ceil(wordCount / wordsPerMinute + imageTime);
};

/**
 * Generate slug from title
 */
PostSchema.methods.generateSlug = function (): string {
  return this.title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

const Post: Model<IPost> =
  mongoose.models.Post || mongoose.model<IPost>('Post', PostSchema);

export default Post;