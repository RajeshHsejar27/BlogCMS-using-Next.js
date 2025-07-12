import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectToDatabase from '@/lib/mongodb';
import Post from '@/lib/models/Post';
import User from '@/lib/models/User';
import { sendApprovalEmail } from '@/lib/utils/email';

/**
 * POST /api/admin/posts/approve - Approve a pending post
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json(
        { message: 'Admin access required' },
        { status: 403 }
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
    
    // Find the post
    const post = await Post.findById(postId).populate('author', 'name email');
    if (!post) {
      return NextResponse.json(
        { message: 'Post not found' },
        { status: 404 }
      );
    }
    
    // Update post status
    post.status = 'published';
    post.publishedAt = new Date();
    await post.save();
    
    // Update user's post count
    await User.findByIdAndUpdate(post.author._id, {
      $inc: { postsCount: 1 },
    });
    
    // Send approval email
    try {
      const author: any = post.author;
      if (author && author.email) {
        await sendApprovalEmail(
          author.email,
          post.title,
          post.slug
        );
      } else {
        console.warn('Author email not available for approval email.');
      }
    } catch (emailError) {
      console.error('Failed to send approval email:', emailError);
      // Don't fail the request if email fails
    }
    
    return NextResponse.json({
      message: 'Post approved successfully',
      post: {
        _id: post._id,
        title: post.title,
        status: post.status,
      },
    });
  } catch (error) {
    console.error('Error approving post:', error);
    return NextResponse.json(
      { message: 'Failed to approve post' },
      { status: 500 }
    );
  }
}