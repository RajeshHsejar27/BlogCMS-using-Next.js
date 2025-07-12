import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectToDatabase from '@/lib/mongodb';
import Post from '@/lib/models/Post';
import Heart from '@/lib/models/Heart';

/**
 * POST /api/posts/heart - Toggle heart for a post
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
    
    const { postId } = await request.json();
    
    if (!postId) {
      return NextResponse.json(
        { message: 'Post ID is required' },
        { status: 400 }
      );
    }
    
    await connectToDatabase();
    
    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
      return NextResponse.json(
        { message: 'Post not found' },
        { status: 404 }
      );
    }
    
    // Check if user already hearted this post
    const existingHeart = await Heart.findOne({
      user: session.user.id,
      post: postId,
    });
    
    if (existingHeart) {
      // Remove heart
      await Heart.deleteOne({ _id: existingHeart._id });
      await Post.findByIdAndUpdate(postId, { $inc: { hearts: -1 } });
      
      return NextResponse.json({
        message: 'Heart removed',
        isHearted: false,
        hearts: post.hearts - 1,
      });
    } else {
      // Add heart
      await Heart.create({
        user: session.user.id,
        post: postId,
      });
      await Post.findByIdAndUpdate(postId, { $inc: { hearts: 1 } });
      
      return NextResponse.json({
        message: 'Post hearted',
        isHearted: true,
        hearts: post.hearts + 1,
      });
    }
  } catch (error) {
    console.error('Error toggling heart:', error);
    return NextResponse.json(
      { message: 'Failed to toggle heart' },
      { status: 500 }
    );
  }
}