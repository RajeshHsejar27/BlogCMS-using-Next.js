import { Card, CardContent } from '@/components/ui/card';

/**
 * Skeleton loader for post grid
 */
export default function PostGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="overflow-hidden shadow-lg border-0 bg-white/95 backdrop-blur-sm">
          <div className="relative">
            {/* Cover image skeleton */}
            <div className="w-full h-48 bg-gradient-to-r from-amber-100 to-amber-200 animate-pulse"></div>
          </div>
          
          <CardContent className="p-6">
            {/* Title skeleton */}
            <div className="h-6 bg-gradient-to-r from-amber-100 to-amber-200 rounded animate-pulse mb-3"></div>
            <div className="h-4 bg-gradient-to-r from-amber-100 to-amber-200 rounded animate-pulse mb-4 w-3/4"></div>
            
            {/* Excerpt skeleton */}
            <div className="space-y-2 mb-4">
              <div className="h-3 bg-gradient-to-r from-amber-100 to-amber-200 rounded animate-pulse"></div>
              <div className="h-3 bg-gradient-to-r from-amber-100 to-amber-200 rounded animate-pulse"></div>
              <div className="h-3 bg-gradient-to-r from-amber-100 to-amber-200 rounded animate-pulse w-2/3"></div>
            </div>
            
            {/* Author skeleton */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-amber-100 to-amber-200 rounded-full animate-pulse"></div>
              <div>
                <div className="h-3 bg-gradient-to-r from-amber-100 to-amber-200 rounded animate-pulse w-20 mb-1"></div>
                <div className="h-3 bg-gradient-to-r from-amber-100 to-amber-200 rounded animate-pulse w-16"></div>
              </div>
            </div>
            
            {/* Meta info skeleton */}
            <div className="flex items-center gap-4 mb-4">
              <div className="h-3 bg-gradient-to-r from-amber-100 to-amber-200 rounded animate-pulse w-12"></div>
              <div className="h-3 bg-gradient-to-r from-amber-100 to-amber-200 rounded animate-pulse w-12"></div>
              <div className="h-3 bg-gradient-to-r from-amber-100 to-amber-200 rounded animate-pulse w-12"></div>
            </div>
            
            {/* Button skeleton */}
            <div className="h-10 bg-gradient-to-r from-amber-100 to-amber-200 rounded animate-pulse"></div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}