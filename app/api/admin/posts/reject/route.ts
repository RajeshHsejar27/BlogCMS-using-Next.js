import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectToDatabase from '@/lib/mongodb';
import Post from '@/lib/models/Post';
import { sendRejectionEmail } from '@/lib/utils/email';

/**
 * POST /api/admin/posts/reject - Reject a pending post
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
    
    const { postId, reason } = await request.json();
    
    if (!postId || !reason) {
      return NextResponse.json(
        { message: 'Post ID and rejection reason are required' },
        { status: 400 }
      );
    }
    
    await connectToDatabase();
    
    // Find the post
    const post = await Post.findById(postId).populate<{ author: { name: string; email: string } }>('author', 'name email');
    if (!post) {
      return NextResponse.json(
        { message: 'Post not found' },
        { status: 404 }
      );
    }
    
    // Update post status
    post.status = 'rejected';
    post.rejectionReason = reason;
    await post.save();
    
    // Send rejection email
    try {
      await sendRejectionEmail(
        (post.author as { email: string }).email,
        post.title,
        reason
      );
    } catch (emailError) {
      console.error('Failed to send rejection email:', emailError);
      // Don't fail the request if email fails
    }
    
    return NextResponse.json({
      message: 'Post rejected successfully',
      post: {
        _id: post._id,
        title: post.title,
        status: post.status,
      },
    });
  } catch (error) {
    console.error('Error rejecting post:', error);
    return NextResponse.json(
      { message: 'Failed to reject post' },
      { status: 500 }
    );
  }
}
