import { Suspense } from 'react';
import { Metadata } from 'next';
import PostGrid from '@/components/PostGrid';
import Hero from '@/components/Hero';
import PostGridSkeleton from '@/components/PostGridSkeleton';

export const metadata: Metadata = {
  title: 'Forest Blog - Natural Stories & Insights',
  description: 'Discover amazing stories from nature and life. Join our community of writers and readers sharing their experiences.',
  openGraph: {
    title: 'Forest Blog - Natural Stories & Insights',
    description: 'Discover amazing stories from nature and life.',
    url: '/',
  },
};

/**
 * Home page component displaying hero section and blog posts
 */
export default function Home() {
  return (
    <div className="min-h-screen">
      <Hero />
      
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-amber-900 mb-4">
              Latest Stories
            </h2>
            <p className="text-lg text-amber-700 max-w-2xl mx-auto">
              Discover amazing stories from our community of nature lovers and writers
            </p>
          </div>
          
          <Suspense fallback={<PostGridSkeleton />}>
            <PostGrid />
          </Suspense>
        </div>
      </section>
    </div>
  );
}