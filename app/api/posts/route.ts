import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectToDatabase from '@/lib/mongodb';
import Post from '@/lib/models/Post';
import User from '@/lib/models/User';
import { createPostSchema } from '@/lib/validations/post';
import { calculateReadingTime, generateExcerpt } from '@/lib/utils/reading-time';
import { deleteFromCloudinary } from '@/lib/cloudinary';

/**
 * GET /api/posts - Get published posts
 */
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;
    
    const posts = await Post.find({ status: 'published' })
      .populate('author', 'name image')
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    
    const total = await Post.countDocuments({ status: 'published' });
    
    return NextResponse.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { message: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/posts - Create new post
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    const validatedData = createPostSchema.parse(body);
    
    await connectToDatabase();
    
    // Check user's daily post limit (5 posts per day)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const dailyPostCount = await Post.countDocuments({
      author: session.user.id,
      createdAt: { $gte: today },
    });
    
    if (dailyPostCount >= 5) {
      return NextResponse.json(
        { message: 'Daily post limit reached. You can create up to 5 posts per day.' },
        { status: 429 }
      );
    }
    
    // Generate slug from title
    const baseSlug = validatedData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    // Ensure unique slug
    let slug = baseSlug;
    let counter = 1;
    while (await Post.findOne({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    
    // Calculate reading time and generate excerpt
    const readingTime = calculateReadingTime(validatedData.content);
    const excerpt = generateExcerpt(validatedData.content);
    
    // Create post
    const post = new Post({
      ...validatedData,
      slug,
      excerpt,
      author: session.user.id,
      readingTime,
      status: 'pending',
      // Extract Cloudinary public ID if it's a Cloudinary URL
      coverImagePublicId: validatedData.coverImage?.includes('cloudinary.com') 
        ? validatedData.coverImage.split('/').pop()?.split('.')[0] 
        : undefined,
    });
    
    await post.save();
    
    return NextResponse.json({
      message: 'Post created successfully',
      post: {
        _id: post._id,
        title: post.title,
        slug: post.slug,
        status: post.status,
      },
    });
  } catch (error) {
    console.error('Error creating post:', error);
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { message: 'Invalid input data', errors: error },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { message: 'Failed to create post' },
      { status: 500 }
    );
  }
}