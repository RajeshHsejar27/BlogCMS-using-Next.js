'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createPostSchema, CreatePostInput } from '@/lib/validations/post';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PenTool, Upload, Save } from 'lucide-react';
import { toast } from 'sonner';
import ImageUpload from '@/components/ImageUpload';
import { Metadata } from 'next';

/**
 * Create post page component
 */
export default function CreatePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [coverImage, setCoverImage] = useState<string>('');
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<CreatePostInput>({
    resolver: zodResolver(createPostSchema),
  });
  
  const watchContent = watch('content', '');
  const watchTitle = watch('title', '');
  
  // Calculate reading time
  const readingTime = Math.ceil(watchContent.split(' ').length / 200);
  
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
   * Handle form submission
   */
  const onSubmit = async (data: CreatePostInput) => {
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      
      if (response.ok) {
        toast.success('Post submitted successfully! It will be reviewed before publishing.');
        router.push('/profile');
      } else {
        toast.error(result.message || 'Failed to create post');
      }
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Failed to create post');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  /**
   * Handle cover image upload
   */
  const handleImageUpload = (url: string) => {
    setValue('coverImage', url);
    setCoverImage(url);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-amber-50 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center pb-8">
            <div className="flex items-center justify-center mb-4">
              <PenTool className="w-8 h-8 text-amber-600 mr-3" />
              <CardTitle className="text-3xl font-bold text-amber-900">
                Create New Post
              </CardTitle>
            </div>
            <CardDescription className="text-lg text-amber-700">
              Share your story with The Venture Blog community
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-amber-900 font-medium">
                  Title
                </Label>
                <Input
                  id="title"
                  {...register('title')}
                  placeholder="Enter your post title..."
                  className="text-lg border-amber-200 focus:border-amber-500 focus:ring-amber-500"
                />
                {errors.title && (
                  <p className="text-red-500 text-sm">{errors.title.message}</p>
                )}
                <p className="text-sm text-amber-600">
                  {watchTitle.length}/100 characters
                </p>
              </div>
              
              {/* Cover Image */}
              <div>
                <ImageUpload
                  onImageUpload={handleImageUpload}
                  currentImage={coverImage}
                  label="Cover Image (Optional)"
                />
                {errors.coverImage && (
                  <p className="text-red-500 text-sm mt-2">{errors.coverImage.message}</p>
                )}
              </div>
              
              {/* Content */}
                <div className="space-y-2">
                <Label htmlFor="content" className="text-amber-900 font-medium">
                  Content
                </Label>
                <div className="relative">
                  <Textarea
                  id="content"
                  {...register('content')}
                  placeholder="Write your post content here... (Markdown supported)"
                  className="h-96 md:h-[32rem] border-amber-200 focus:border-amber-500 focus:ring-amber-500 resize-none overflow-y-auto"
                  style={{ minHeight: '24rem', maxHeight: '40rem' }}
                  />
                  {/* Optionally, you can add a custom scrollbar style here */}
                </div>
                {errors.content && (
                  <p className="text-red-500 text-sm">{errors.content.message}</p>
                )}
                <div className="flex justify-between text-sm text-amber-600">
                  <span>{watchContent.split(' ').length} words</span>
                  <span>~{readingTime} min read</span>
                </div>
                </div>
              
              {/* Tags */}
              <div className="space-y-2">
                <Label htmlFor="tags" className="text-amber-900 font-medium">
                  Tags (Optional)
                </Label>
                <Input
                  id="tags"
                  placeholder="nature, forest, adventure (comma separated)"
                  className="border-amber-200 focus:border-amber-500 focus:ring-amber-500"
                  onChange={(e) => {
                    const tags = e.target.value.split(',').map(tag => tag.trim()).filter(Boolean);
                    setValue('tags', tags);
                  }}
                />
                <p className="text-sm text-amber-600">
                  Separate tags with commas
                </p>
              </div>
              
              {/* Submit button */}
              <div className="pt-6">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white font-medium py-3 text-lg"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5 mr-2" />
                      Submit for Review
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}