import Image from 'next/image';
import Link from 'next/link';
import { Heart, MessageCircle, Clock, User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import connectToDatabase from '@/lib/mongodb';
import Post from '@/lib/models/Post';

/**
 * Get published posts for the home page
 */
async function getPosts() {
  await connectToDatabase();
  
  const posts = await Post.find({ status: 'published' })
    .populate('author', 'name image')
    .sort({ publishedAt: -1 })
    .limit(12)
    .lean();
  
  return JSON.parse(JSON.stringify(posts));
}

/**
 * Post grid component displaying published blog posts
 */
export default async function PostGrid() {
  const posts = await getPosts();
  
  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🌲</div>
        <h3 className="text-2xl font-semibold text-amber-900 mb-2">
          No stories yet
        </h3>
        <p className="text-amber-700 text-lg">
          Be the first to share your story with our community
        </p>
      </div>
    );
  }
  
  return (
    <div id="stories" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {posts.map((post: any) => (
        <Card key={post._id} className="group overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-white/95 backdrop-blur-sm">
          <div className="relative">
            {/* Cover image */}
            <div className="relative w-full h-48 overflow-hidden">
              <Image
                src={post.coverImage || 'https://images.pexels.com/photos/1261728/pexels-photo-1261728.jpeg?auto=compress&cs=tinysrgb&w=800'}
                alt={post.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            
            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="absolute top-4 left-4 flex flex-wrap gap-1">
                {post.tags.slice(0, 2).map((tag: string) => (
                  <span
                    key={tag}
                    className="bg-amber-900/80 text-amber-100 px-2 py-1 rounded-full text-xs font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
          
          <CardContent className="p-6">
            {/* Title */}
            <h3 className="text-xl font-semibold text-amber-900 mb-3 line-clamp-2 group-hover:text-amber-800 transition-colors">
              {post.title}
            </h3>
            
            {/* Excerpt */}
            <p className="text-amber-700 mb-4 line-clamp-3 text-sm">
              {post.excerpt || post.content.substring(0, 120) + '...'}
            </p>
            
            {/* Author */}
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
                <p className="font-medium text-amber-900 text-sm">{post.author.name}</p>
                <p className="text-amber-600 text-xs">
                  {new Date(post.publishedAt || post.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            
            {/* Meta info */}
            <div className="flex items-center justify-between text-amber-600 text-sm mb-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{post.readingTime} min</span>
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="w-4 h-4" />
                  <span>{post.hearts}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="w-4 h-4" />
                  <span>{post.comments?.length || 0}</span>
                </div>
              </div>
            </div>
            
            {/* Read more link */}
            <Link
              href={`/posts/${post.slug}`}
              className="inline-block w-full text-center bg-amber-600 hover:bg-amber-700 text-white py-2 px-4 rounded-lg transition-colors duration-200 font-medium"
            >
              Read Story
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}