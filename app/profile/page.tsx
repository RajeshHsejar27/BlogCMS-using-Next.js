'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PenTool, Heart, MessageCircle, Clock, Plus, Eye } from 'lucide-react';
import { toast } from 'sonner';

interface UserPost {
  _id: string;
  title: string;
  excerpt: string;
  coverImage: string;
  status: 'pending' | 'published' | 'rejected';
  hearts: number;
  comments: any[];
  readingTime: number;
  createdAt: string;
  rejectionReason?: string;
  slug: string;
}

/**
 * Profile page component
 */
export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [posts, setPosts] = useState<UserPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalHearts: 0,
    totalComments: 0,
  });
  
  // Redirect if not authenticated
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
  
  if (!session) {
    router.push('/auth');
    return null;
  }
  
  /**
   * Fetch user posts and stats
   */
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/user/posts');
        const data = await response.json();
        
        if (response.ok) {
          setPosts(data.posts);
          setStats(data.stats);
        } else {
          toast.error('Failed to load profile data');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast.error('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, []);
  
  /**
   * Get status badge color
   */
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-900 mx-auto mb-4"></div>
          <p className="text-amber-700">Loading profile...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-amber-50 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Profile Header */}
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm mb-8">
          <CardHeader className="text-center pb-8">
            <div className="relative w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden">
              <Image
                src={session.user?.image || '/images/user.png'}
                alt={session.user?.name || 'Profile'}
                fill
                className="object-cover"
              />
            </div>
            <CardTitle className="text-3xl font-bold text-amber-900 mb-2">
              {session.user?.name}
            </CardTitle>
            <p className="text-amber-700">{session.user?.email}</p>
          </CardHeader>
          
          <CardContent>
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-900 mb-2">
                  {stats.totalPosts}
                </div>
                <div className="text-amber-700">Posts</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-900 mb-2">
                  {stats.totalHearts}
                </div>
                <div className="text-amber-700">Hearts Received</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-900 mb-2">
                  {stats.totalComments}
                </div>
                <div className="text-amber-700">Comments</div>
              </div>
            </div>
            
            {/* Create New Post Button */}
            <div className="text-center">
              <Link href="/create">
                <Button className="bg-amber-600 hover:bg-amber-700 text-white font-medium px-8 py-3">
                  <Plus className="w-5 h-5 mr-2" />
                  Create New Post
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
        
        {/* Posts Section */}
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-amber-900 flex items-center">
              <PenTool className="w-6 h-6 mr-3" />
              Your Posts
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            {posts.length === 0 ? (
              <div className="text-center py-12">
                <PenTool className="w-16 h-16 text-amber-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-amber-900 mb-2">
                  No posts yet
                </h3>
                <p className="text-amber-700 mb-6">
                  Start sharing your stories with the world
                </p>
                <Link href="/create">
                  <Button className="bg-amber-600 hover:bg-amber-700 text-white">
                    <Plus className="w-5 h-5 mr-2" />
                    Create Your First Post
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid gap-6">
                {posts.map((post) => (
                  <div
                    key={post._id}
                    className="bg-gradient-to-r from-amber-50 to-green-50 rounded-lg p-6 border border-amber-200"
                  >
                    <div className="flex flex-col md:flex-row gap-4">
                      {/* Cover Image */}
                      <div className="relative w-full md:w-48 h-32 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={post.coverImage}
                          alt={post.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-xl font-semibold text-amber-900 line-clamp-1">
                            {post.title}
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(post.status)}`}>
                            {post.status}
                          </span>
                        </div>
                        
                        <p className="text-amber-700 mb-4 line-clamp-2">
                          {post.excerpt}
                        </p>
                        
                        {/* Rejection reason */}
                        {post.status === 'rejected' && post.rejectionReason && (
                          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                            <p className="text-red-800 text-sm">
                              <strong>Rejection Reason:</strong> {post.rejectionReason}
                            </p>
                          </div>
                        )}
                        
                        {/* Meta info */}
                        <div className="flex flex-wrap items-center gap-4 text-sm text-amber-600 mb-4">
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
                        
                        {/* Action button */}
                        {post.status === 'published' && (
                          <Link href={`/posts/${post.slug}`}>
                            <Button variant="outline" className="border-amber-300 text-amber-700 hover:bg-amber-50">
                              <Eye className="w-4 h-4 mr-2" />
                              View Post
                            </Button>
                          </Link>
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