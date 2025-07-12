import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectToDatabase from '@/lib/mongodb';
import Post from '@/lib/models/Post';
import User from '@/lib/models/User';
import { commentSchema } from '@/lib/validations/post';

/**
 * POST /api/posts/comment - Add comment to a post
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
    const validatedData = commentSchema.parse(body);
    
    await connectToDatabase();
    
    // Check if post exists
    const post = await Post.findById(validatedData.postId);
    if (!post) {
      return NextResponse.json(
        { message: 'Post not found' },
        { status: 404 }
      );
    }
    
    // Get user data
    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }
    
    // Create comment
    const comment = {
      author: session.user.id,
      content: validatedData.content,
      createdAt: new Date(),
    };
    
    // Add comment to post
    await Post.findByIdAndUpdate(validatedData.postId, {
      $push: { comments: comment },
    });
    
    // Return comment with author info
    return NextResponse.json({
      message: 'Comment added successfully',
      comment: {
        _id: new Date().getTime().toString(), // Temporary ID
        author: {
          _id: user._id,
          name: user.name,
          image: user.image,
        },
        content: comment.content,
        createdAt: comment.createdAt,
      },
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { message: 'Invalid input data', errors: error },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { message: 'Failed to add comment' },
      { status: 500 }
    );
  }
}