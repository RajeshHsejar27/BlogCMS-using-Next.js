'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Heart, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

interface PostActionsProps {
  postId: string;
  initialHearts: number;
}

/**
 * Post actions component for hearts and comments
 */
export default function PostActions({ postId, initialHearts }: PostActionsProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [hearts, setHearts] = useState(initialHearts);
  const [isHearted, setIsHearted] = useState(false);
  const [loading, setLoading] = useState(false);
  
  /**
   * Handle heart/unheart action
   */
  const handleHeart = async () => {
    if (!session) {
      toast.error('Please sign in to heart posts');
      router.push('/auth');
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await fetch('/api/posts/heart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ postId }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setHearts(data.hearts);
        setIsHearted(data.isHearted);
        toast.success(data.isHearted ? 'Post hearted!' : 'Heart removed');
      } else {
        toast.error(data.message || 'Failed to update heart');
      }
    } catch (error) {
      console.error('Error updating heart:', error);
      toast.error('Failed to update heart');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Card className="my-8 shadow-lg border-0 bg-white/95 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-center gap-4">
          <Button
            onClick={handleHeart}
            disabled={loading}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
              isHearted
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-amber-100 hover:bg-amber-200 text-amber-900'
            }`}
          >
            <Heart className={`w-5 h-5 ${isHearted ? 'fill-current' : ''}`} />
            <span>{hearts} Hearts</span>
          </Button>
          
          <Button
            onClick={() => {
              document.getElementById('comments')?.scrollIntoView({ behavior: 'smooth' });
            }}
            variant="outline"
            className="flex items-center gap-2 px-6 py-3 border-amber-300 text-amber-700 hover:bg-amber-50"
          >
            <MessageCircle className="w-5 h-5" />
            <span>Comments</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}