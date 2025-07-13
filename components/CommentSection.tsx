'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { commentSchema, CommentInput } from '@/lib/validations/post';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle, Send } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';

interface Comment {
  _id: string;
  author: {
    _id: string;
    name: string;
    image: string;
  };
  content: string;
  createdAt: string;
}

interface CommentSectionProps {
  postId: string;
  comments: Comment[];
}

/**
 * Comment section component for blog posts
 */
export default function CommentSection({ postId, comments: initialComments }: CommentSectionProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [comments, setComments] = useState(initialComments);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CommentInput>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      postId,
    },
  });
  
  /**
   * Handle comment submission
   */
  const onSubmit = async (data: CommentInput) => {
    if (!session) {
      toast.error('Please sign in to comment');
      router.push('/auth');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/posts/comment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      
      if (response.ok) {
        setComments([result.comment, ...comments]);
        reset();
        toast.success('Comment added successfully!');
      } else {
        toast.error(result.message || 'Failed to add comment');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card id="comments" className="my-8 shadow-lg border-0 bg-white/95 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-amber-900">
          <MessageCircle className="w-6 h-6" />
          Comments ({comments.length})
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Comment form */}
        {session ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                <Image
                  src={session.user?.image || 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150'}
                  alt={session.user?.name || 'Profile'}
                  fill
                  className="object-cover"
                />
              </div>
              
              <div className="flex-1">
                <Textarea
                  {...register('content')}
                  placeholder="Share your thoughts..."
                  className="min-h-24 border-amber-200 focus:border-amber-500 focus:ring-amber-500"
                />
                {errors.content && (
                  <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>
                )}
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-amber-600 hover:bg-amber-700 text-white"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Posting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Post Comment
                  </>
                )}
              </Button>
            </div>
          </form>
        ) : (
          <div className="text-center py-8 bg-amber-50 rounded-lg">
            <MessageCircle className="w-12 h-12 text-amber-400 mx-auto mb-4" />
            <p className="text-amber-700 mb-4">Sign in to join the conversation</p>
            <Button
              onClick={() => router.push('/auth')}
              className="bg-amber-600 hover:bg-amber-700 text-white"
            >
              Sign In
            </Button>
          </div>
        )}
        
        {/* Comments list */}
        <div className="space-y-4">
          {comments.length === 0 ? (
            <div className="text-center py-8 text-amber-600">
              <MessageCircle className="w-12 h-12 text-amber-300 mx-auto mb-4" />
              <p>No comments yet. Be the first to share your thoughts!</p>
            </div>
          ) : (
            comments.map((comment) => (
              <div key={comment._id} className="flex items-start gap-4 p-4 bg-amber-50 rounded-lg">
                <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                  <Image
                    src={comment.author.image || '/images/user.png'}
                    alt={comment.author.name}
                    fill
                    className="object-cover"
                  />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium text-amber-900">{comment.author.name}</span>
                    <span className="text-amber-600 text-sm">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-amber-800">{comment.content}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}