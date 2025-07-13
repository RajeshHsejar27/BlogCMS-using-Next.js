import { TreePine, PenTool, Users, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

/**
 * Hero section component for the home page
 */
export default function Hero() {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-green-100 via-amber-50 to-green-50 flex items-center justify-center overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-amber-400 rounded-full blur-xl"></div>
        <div className="absolute top-32 right-20 w-24 h-24 bg-green-400 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-amber-300 rounded-full blur-xl"></div>
        <div className="absolute bottom-32 right-1/3 w-28 h-28 bg-green-300 rounded-full blur-xl"></div>
      </div>
      
      <div className="container mx-auto px-4 py-20 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Main heading */}
          <div className="flex items-center justify-center mb-6">
            <TreePine className="w-16 h-16 text-green-600 mr-4" />
            <h1 className="text-5xl md:text-7xl font-bold text-amber-900">
              The Venture Blog
            </h1>
          </div>
          
          <p className="text-xl md:text-2xl text-amber-700 mb-8 max-w-2xl mx-auto leading-relaxed">
            Where stories grow like ancient trees, connecting hearts through the peoples' experiences and adventures.
          </p>
          
          {/* Feature highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-3xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-lg">
              <PenTool className="w-8 h-8 text-amber-600 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-amber-900 mb-2">Share Stories</h3>
              <p className="text-amber-700 text-sm">
                Write and share your adventures, insights, and experiences with our community
              </p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-lg">
              <Users className="w-8 h-8 text-green-600 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-amber-900 mb-2">Join Community</h3>
              <p className="text-amber-700 text-sm">
                Connect with fellow writers, and explorers from around the world
              </p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-lg">
              <Heart className="w-8 h-8 text-red-500 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-amber-900 mb-2">Spread Love</h3>
              <p className="text-amber-700 text-sm">
                Heart your favorite stories and engage with content that inspires you
              </p>
            </div>
          </div>
          
          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth">
              <Button className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 text-lg font-semibold shadow-lg">
                Join Our Community
              </Button>
            </Link>
            
            <Link href="#stories">
              <Button 
                variant="outline" 
                className="border-amber-600 text-amber-700 hover:bg-amber-50 px-8 py-3 text-lg font-semibold shadow-lg"
              >
                Explore Stories
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}