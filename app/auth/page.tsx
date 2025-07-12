'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LogIn, LogOut, User, TreePine } from 'lucide-react';
import Image from 'next/image';

/**
 * Authentication page component
 */
export default function AuthPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  // Redirect if already authenticated
  useEffect(() => {
    if (session) {
      router.push('/profile');
    }
  }, [session, router]);
  
  /**
   * Handle Google sign in
   */
  const handleSignIn = async () => {
    try {
      await signIn('google', { callbackUrl: '/profile' });
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };
  
  /**
   * Handle sign out
   */
  const handleSignOut = async () => {
    try {
      await signOut({ callbackUrl: '/' });
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  
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
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-amber-50 flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-md shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
        <CardHeader className="text-center pb-8">
          <div className="flex items-center justify-center mb-6">
            <TreePine className="w-12 h-12 text-green-600 mr-3" />
            <CardTitle className="text-3xl font-bold text-amber-900">
              Forest Blog
            </CardTitle>
          </div>
          <CardDescription className="text-lg text-amber-700">
            {session ? 'Welcome back!' : 'Welcome to our natural community'}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {session ? (
            /* User is signed in */
            <div className="text-center space-y-6">
              <div className="relative w-20 h-20 mx-auto rounded-full overflow-hidden">
                <Image
                  src={session.user?.image || 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150'}
                  alt={session.user?.name || 'Profile'}
                  fill
                  className="object-cover"
                />
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-amber-900 mb-2">
                  {session.user?.name}
                </h3>
                <p className="text-amber-700">{session.user?.email}</p>
                {session.user?.role === 'admin' && (
                  <p className="text-green-600 font-medium mt-1">Admin</p>
                )}
              </div>
              
              <div className="space-y-3">
                <Button
                  onClick={() => router.push('/profile')}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white"
                >
                  <User className="w-5 h-5 mr-2" />
                  View Profile
                </Button>
                
                <Button
                  onClick={handleSignOut}
                  variant="outline"
                  className="w-full border-amber-300 text-amber-700 hover:bg-amber-50"
                >
                  <LogOut className="w-5 h-5 mr-2" />
                  Sign Out
                </Button>
              </div>
            </div>
          ) : (
            /* User is not signed in */
            <div className="text-center space-y-6">
              <div className="bg-gradient-to-r from-green-100 to-amber-100 rounded-lg p-6 mb-6">
                <TreePine className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-amber-900 mb-2">
                  Join Our Community
                </h3>
                <p className="text-amber-700">
                  Share your stories, connect with nature lovers, and discover amazing content
                </p>
              </div>
              
              <Button
                onClick={handleSignIn}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 text-lg"
              >
                <LogIn className="w-5 h-5 mr-2" />
                Sign In with Google
              </Button>
              
              <div className="text-sm text-amber-600 space-y-2">
                <p>✓ No password required</p>
                <p>✓ Secure authentication</p>
                <p>✓ Start writing immediately</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}