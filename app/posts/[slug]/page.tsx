import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Clock, Heart, MessageCircle, User } from 'lucide-react';
import connectToDatabase from '@/lib/mongodb';
import Post from '@/lib/models/Post';
import UserModel from '@/lib/models/User';
import PostActions from '@/components/PostActions';
import CommentSection from '@/components/CommentSection';
// import ReactMarkdown from 'react-markdown';
// import remarkGfm from 'remark-gfm';
import MarkdownRenderer from '@/components/MarkdownRenderer';
interface PostPageProps {
  params: {
    slug: string;
  };
}

/**
 * Get post data by slug
 */
async function getPost(slug: string) {
  await connectToDatabase();
  
  const post = await Post.findOne({ slug, status: 'published' })
    .populate('author', 'name image')
    .lean();
  
  if (!post) {
    return null;
  }
  
  return JSON.parse(JSON.stringify(post));
}

/**
 * Generate metadata for post page
 */
export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const post = await getPost(params.slug);
  
  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }
  
  return {
    title: `${post.title} | The Venture Blog`,
    description: post.excerpt || post.content.substring(0, 50000) + '...',
    openGraph: {
      title: post.title,
      description: post.excerpt || post.content.substring(0, 50000) + '...',
      url: `/posts/${post.slug}`,
      images: [
        {
          url: post.coverImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
  };
}

/**
 * Post page component
 */
export default async function PostPage({ params }: PostPageProps) {
  const post = await getPost(params.slug);
  
  if (!post) {
    notFound();
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-amber-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back button */}
        <Link
          href="/"
          className="inline-flex items-center text-amber-700 hover:text-amber-800 mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Home
        </Link>
        
        {/* Post header */}
        <article className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Cover image */}
          <div className="relative w-full h-96">
            <Image
              src={post.coverImage || 'https://images.pexels.com/photos/1261728/pexels-photo-1261728.jpeg?auto=compress&cs=tinysrgb&w=1200'}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
          
          {/* Post content */}
          <div className="p-8">
            <header className="mb-8">
              <h1 className="text-4xl md:text-5xl font-bold text-amber-900 mb-6 leading-tight">
                {post.title}
              </h1>
              
              {/* Author and meta info */}
              <div className="flex flex-wrap items-center gap-6 text-amber-700 mb-6">
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden">
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
                <div className="flex flex-wrap gap-2 mb-6">
                  {post.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </header>
            
            {/* Post content */}
            <div className="prose prose-lg max-w-none prose-headings:text-amber-900 prose-a:text-green-700 prose-blockquote:border-l-amber-500 prose-blockquote:text-amber-800">
              <MarkdownRenderer content={post.content} />
            </div>
          </div>
        </article>
        
        {/* Post actions */}
        <PostActions postId={post._id} initialHearts={post.hearts} />
        
        {/* Comments section */}
        <CommentSection postId={post._id} comments={post.comments || []} />
      </div>
    </div>
  );
}