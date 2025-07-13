'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Shield, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Heart, 
  MessageCircle, 
  User,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface PendingPost {
  _id: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: {
    _id: string;
    name: string;
    email: string;
    image: string;
  };
  status: 'pending' | 'published' | 'rejected';
  hearts: number;
  comments: any[];
  readingTime: number;
  createdAt: string;
  slug: string;
  tags?: string[];
}

/**
 * Post preview modal component
 */
function PostPreviewModal({ post }: { post: PendingPost }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="border-amber-300 text-amber-700 hover:bg-amber-50"
        >
          <Eye className="w-4 h-4 mr-2" />
          Preview
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-amber-900">
            Post Preview
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Cover Image */}
          <div className="relative w-full h-64 rounded-lg overflow-hidden">
            <Image
              src={post.coverImage || 'https://images.pexels.com/photos/1261728/pexels-photo-1261728.jpeg?auto=compress&cs=tinysrgb&w=800'}
              alt={post.title}
              fill
              className="object-cover"
            />
          </div>
          
          {/* Post Header */}
          <div>
            <h1 className="text-3xl font-bold text-amber-900 mb-4">
              {post.title}
            </h1>
            
            {/* Author and meta info */}
            <div className="flex flex-wrap items-center gap-4 text-amber-700 mb-4">
              <div className="flex items-center gap-2">
                <div className="relative w-8 h-8 rounded-full overflow-hidden">
                  <Image
                    src={post.author.image || '/images/user.png'}
                    alt={post.author.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <span className="font-medium">{post.author.name}</span>
              </div>
              
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{post.readingTime} min read</span>
              </div>
              
              <div className="flex items-center gap-1">
                <Heart className="w-4 h-4" />
                <span>{post.hearts} hearts</span>
              </div>
              
              <div className="flex items-center gap-1">
                <MessageCircle className="w-4 h-4" />
                <span>{post.comments?.length || 0} comments</span>
              </div>
            </div>
            
            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
          
          {/* Post Content */}
          <div className="prose prose-lg max-w-none prose-headings:text-amber-900 prose-a:text-green-700 prose-blockquote:border-l-amber-500 prose-blockquote:text-amber-800">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                img: ({ node, ...props }) => (
                  <Image
                    src={props.src || ''}
                    alt={props.alt || ''}
                    width={600}
                    height={300}
                    className="rounded-lg shadow-md"
                  />
                ),
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Admin dashboard component
 */
export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [posts, setPosts] = useState<PendingPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [rejectionReason, setRejectionReason] = useState('');
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  
  // Redirect if not authenticated or not admin
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-900 mx-auto mb-4"></div>
          <p className="text-amber-700">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!session || session.user?.role !== 'admin') {
    router.push('/');
    return null;
  }
  
  /**
   * Fetch pending posts
   */
  useEffect(() => {
    const fetchPendingPosts = async () => {
      try {
        const response = await fetch('/api/admin/posts');
        const data = await response.json();
        
        if (response.ok) {
          setPosts(data.posts);
        } else {
          toast.error('Failed to load pending posts');
        }
      } catch (error) {
        console.error('Error fetching pending posts:', error);
        toast.error('Failed to load pending posts');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPendingPosts();
  }, []);
  
  /**
   * Handle post approval
   */
  const handleApprove = async (postId: string) => {
    try {
      const response = await fetch('/api/admin/posts/approve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ postId }),
      });
      
      if (response.ok) {
        setPosts(posts.filter(post => post._id !== postId));
        toast.success('Post approved successfully!');
      } else {
        toast.error('Failed to approve post');
      }
    } catch (error) {
      console.error('Error approving post:', error);
      toast.error('Failed to approve post');
    }
  };
  
  /**
   * Handle post rejection
   */
  const handleReject = async (postId: string) => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }
    
    try {
      const response = await fetch('/api/admin/posts/reject', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ postId, reason: rejectionReason }),
      });
      
      if (response.ok) {
        setPosts(posts.filter(post => post._id !== postId));
        setRejectionReason('');
        setSelectedPost(null);
        toast.success('Post rejected successfully!');
      } else {
        toast.error('Failed to reject post');
      }
    } catch (error) {
      console.error('Error rejecting post:', error);
      toast.error('Failed to reject post');
    }
  };
  
  /**
   * Handle post deletion
   */
  const handleDelete = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/admin/posts/${postId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setPosts(posts.filter(post => post._id !== postId));
        toast.success('Post deleted successfully!');
      } else {
        toast.error('Failed to delete post');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Failed to delete post');
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-900 mx-auto mb-4"></div>
          <p className="text-amber-700">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-amber-50 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Admin Header */}
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm mb-8">
          <CardHeader className="text-center pb-8">
            <div className="flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-amber-600 mr-3" />
              <CardTitle className="text-3xl font-bold text-amber-900">
                Admin Dashboard
              </CardTitle>
            </div>
            <p className="text-amber-700">Manage blog posts and content</p>
          </CardHeader>
        </Card>
        
        {/* Pending Posts */}
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-amber-900 flex items-center">
              <Clock className="w-6 h-6 mr-3" />
              Pending Posts ({posts.filter(p => p.status === 'pending').length})
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            {posts.filter(p => p.status === 'pending').length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle className="w-16 h-16 text-green-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-amber-900 mb-2">
                  No pending posts
                </h3>
                <p className="text-amber-700">
                  All posts have been reviewed
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {posts.filter(p => p.status === 'pending').map((post) => (
                  <div
                    key={post._id}
                    className="bg-gradient-to-r from-amber-50 to-green-50 rounded-lg p-6 border border-amber-200"
                  >
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Cover Image */}
                      <div className="relative w-full lg:w-64 h-48 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={post.coverImage || 'https://images.pexels.com/photos/1261728/pexels-photo-1261728.jpeg?auto=compress&cs=tinysrgb&w=400'}
                          alt={post.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                          <h3 className="text-xl font-semibold text-amber-900">
                            {post.title}
                          </h3>
                          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                            {post.status}
                          </Badge>
                        </div>
                        
                        {/* Author info */}
                        <div className="flex items-center gap-3 mb-4">
                          <div className="relative w-8 h-8 rounded-full overflow-hidden">
                            <Image
                              src={post.author.image || '/images/user.png'}
                              alt={post.author.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-medium text-amber-900">{post.author.name}</p>
                            <p className="text-sm text-amber-600">{post.author.email}</p>
                          </div>
                        </div>
                        
                        {/* Excerpt */}
                        <p className="text-amber-700 mb-4 line-clamp-3">
                          {post.excerpt}
                        </p>
                        
                        {/* Meta info */}
                        <div className="flex flex-wrap items-center gap-4 text-sm text-amber-600 mb-6">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{post.readingTime} min read</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Heart className="w-4 h-4" />
                            <span>{post.hearts} hearts</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageCircle className="w-4 h-4" />
                            <span>{post.comments?.length || 0} comments</span>
                          </div>
                          <span>
                            {new Date(post.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        
                        {/* Action buttons */}
                        <div className="flex flex-wrap gap-3">
                          <Button
                            onClick={() => handleApprove(post._id)}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Approve
                          </Button>
                          
                          <Button
                            onClick={() => setSelectedPost(selectedPost === post._id ? null : post._id)}
                            variant="outline"
                            className="border-red-300 text-red-700 hover:bg-red-50"
                          >
                            <XCircle className="w-4 h-4 mr-2" />
                            Reject
                          </Button>
                          
                          <PostPreviewModal post={post} />
                          
                          <Button
                            onClick={() => handleDelete(post._id)}
                            variant="outline"
                            className="border-red-300 text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </Button>
                        </div>
                        
                        {/* Rejection form */}
                        {selectedPost === post._id && (
                          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <Label htmlFor="rejection-reason" className="text-red-800 font-medium mb-2 block">
                              Rejection Reason
                            </Label>
                            <Textarea
                              id="rejection-reason"
                              value={rejectionReason}
                              onChange={(e) => setRejectionReason(e.target.value)}
                              placeholder="Please provide a reason for rejection..."
                              className="mb-3 border-red-300 focus:border-red-500 focus:ring-red-500"
                            />
                            <div className="flex gap-2">
                              <Button
                                onClick={() => handleReject(post._id)}
                                className="bg-red-600 hover:bg-red-700 text-white"
                              >
                                Confirm Rejection
                              </Button>
                              <Button
                                onClick={() => {
                                  setSelectedPost(null);
                                  setRejectionReason('');
                                }}
                                variant="outline"
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}