import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectToDatabase from '@/lib/mongodb';
import Post from '@/lib/models/Post';

/**
 * GET /api/user/posts - Get user's posts and stats
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      );
    }
    
    await connectToDatabase();
    
    // Get user's posts
    const posts = await Post.find({ author: session.user.id })
      .sort({ createdAt: -1 })
      .lean();
    
    // Calculate stats
    const stats = {
      totalPosts: posts.length,
      totalHearts: posts.reduce((sum, post) => sum + post.hearts, 0),
      totalComments: posts.reduce((sum, post) => sum + (post.comments?.length || 0), 0),
    };
    
    return NextResponse.json({
      posts,
      stats,
    });
  } catch (error) {
    console.error('Error fetching user posts:', error);
    return NextResponse.json(
      { message: 'Failed to fetch user posts' },
      { status: 500 }
    );
  }
}