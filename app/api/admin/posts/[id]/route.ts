import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectToDatabase from '@/lib/mongodb';
import Post from '@/lib/models/Post';
import Heart from '@/lib/models/Heart';
import { deleteFromCloudinary } from '@/lib/cloudinary';

/**
 * DELETE /api/admin/posts/[id] - Delete a post
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json(
        { message: 'Admin access required' },
        { status: 403 }
      );
    }
    
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { message: 'Post ID is required' },
        { status: 400 }
      );
    }
    
    await connectToDatabase();
    
    // Find the post
    const post = await Post.findById(id);
    if (!post) {
      return NextResponse.json(
        { message: 'Post not found' },
        { status: 404 }
      );
    }
    
    // Delete cover image from Cloudinary if it exists
    if (post.coverImagePublicId) {
      try {
        await deleteFromCloudinary(post.coverImagePublicId);
      } catch (error) {
        console.error('Failed to delete image from Cloudinary:', error);
        // Don't fail the request if image deletion fails
      }
    }
    
    // Delete associated hearts
    await Heart.deleteMany({ post: id });
    
    // Delete the post
    await Post.findByIdAndDelete(id);
    
    return NextResponse.json({
      message: 'Post deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json(
      { message: 'Failed to delete post' },
      { status: 500 }
    );
  }
}