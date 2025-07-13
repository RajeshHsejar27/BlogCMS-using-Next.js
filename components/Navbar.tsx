'use client';

import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { 
  TreePine, 
  Home, 
  PenTool, 
  User, 
  LogIn, 
  LogOut, 
  Menu, 
  X,
  Shield
} from 'lucide-react';

/**
 * Navigation bar component with responsive design
 */
export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  /**
   * Check if link is active
   */
  const isActive = (path: string) => pathname === path;
  
  /**
   * Handle mobile menu toggle
   */
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
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
  
  return (
    <nav className="bg-gradient-to-r from-amber-800 to-amber-900 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <TreePine className="w-8 h-8 text-amber-100" />
            <span className="text-xl font-bold text-amber-100">The Venture Blog</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/') 
                  ? 'bg-amber-700 text-white' 
                  : 'text-amber-200 hover:bg-amber-700 hover:text-white'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Link>
            
            {session && (
              <Link
                href="/create"
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/create') 
                    ? 'bg-amber-700 text-white' 
                    : 'text-amber-200 hover:bg-amber-700 hover:text-white'
                }`}
              >
                <PenTool className="w-4 h-4" />
                <span>Create</span>
              </Link>
            )}
            
            {session?.user?.role === 'admin' && (
              <Link
                href="/admin"
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/admin') 
                    ? 'bg-amber-700 text-white' 
                    : 'text-amber-200 hover:bg-amber-700 hover:text-white'
                }`}
              >
                <Shield className="w-4 h-4" />
                <span>Admin</span>
              </Link>
            )}
            
            {session ? (
              <div className="flex items-center space-x-4">
                <Link
                  href="/profile"
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/profile') 
                      ? 'bg-amber-700 text-white' 
                      : 'text-amber-200 hover:bg-amber-700 hover:text-white'
                  }`}
                >
                  <div className="relative w-6 h-6 rounded-full overflow-hidden">
                    <Image
                      src={session.user?.image || '/images/user.png'}
                      alt={session.user?.name || 'Profile'}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <span>Profile</span>
                </Link>
                
                <Button
                  onClick={handleSignOut}
                  variant="default"
                  size="sm"
                  className="bg-green-800 hover:bg-green-900 text-white border-none"
                >
                  <LogOut className="w-4 h-4 mr-1" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <Link href="/auth">
                <Button
                  variant="default"
                  size="sm"
                  className="bg-green-800 hover:bg-green-900 text-white border-none"
                >
                  <LogIn className="w-4 h-4 mr-1" />
                  Sign In
                </Button>
              </Link>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              onClick={toggleMobileMenu}
              variant="ghost"
              size="sm"
              className="text-amber-200 hover:bg-amber-700 hover:text-white"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col space-y-2">
              <Link
                href="/"
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/') 
                    ? 'bg-amber-700 text-white' 
                    : 'text-amber-200 hover:bg-amber-700 hover:text-white'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Home className="w-4 h-4" />
                <span>Home</span>
              </Link>
              
              {session && (
                <Link
                  href="/create"
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/create') 
                      ? 'bg-amber-700 text-white' 
                      : 'text-amber-200 hover:bg-amber-700 hover:text-white'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <PenTool className="w-4 h-4" />
                  <span>Create</span>
                </Link>
              )}
              
              {session?.user?.role === 'admin' && (
                <Link
                  href="/admin"
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/admin') 
                      ? 'bg-amber-700 text-white' 
                      : 'text-amber-200 hover:bg-amber-700 hover:text-white'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Shield className="w-4 h-4" />
                  <span>Admin</span>
                </Link>
              )}
              
              {session ? (
                <>
                  <Link
                    href="/profile"
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive('/profile') 
                        ? 'bg-amber-700 text-white' 
                        : 'text-amber-200 hover:bg-amber-700 hover:text-white'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <User className="w-4 h-4" />
                    <span>Profile</span>
                  </Link>
                  
                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-amber-200 hover:bg-amber-700 hover:text-white transition-colors text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <Link
                  href="/auth"
                  className={`flex bg-green-800 items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/auth') 
                      ? 'bg-amber-700 text-white' 
                      : 'text-amber-200 hover:bg-amber-700 hover:text-white'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}