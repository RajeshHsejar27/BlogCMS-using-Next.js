import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import AuthProvider from '@/components/AuthProvider';
import Navbar from '@/components/Navbar';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Forest Blog - Natural Stories & Insights',
  description: 'A beautiful blog platform for sharing stories from nature and life. Join our community of writers and readers.',
  keywords: ['blog', 'nature', 'stories', 'forest', 'writing', 'community'],
  authors: [{ name: 'Forest Blog Team' }],
  creator: 'Forest Blog',
  publisher: 'Forest Blog',
  openGraph: {
    title: 'Forest Blog - Natural Stories & Insights',
    description: 'A beautiful blog platform for sharing stories from nature and life.',
    url: process.env.NEXTAUTH_URL,
    siteName: 'Forest Blog',
    images: [
      {
        url: 'https://images.pexels.com/photos/1261728/pexels-photo-1261728.jpeg?auto=compress&cs=tinysrgb&w=1200',
        width: 1200,
        height: 630,
        alt: 'Forest Blog',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Forest Blog - Natural Stories & Insights',
    description: 'A beautiful blog platform for sharing stories from nature and life.',
    images: ['https://images.pexels.com/photos/1261728/pexels-photo-1261728.jpeg?auto=compress&cs=tinysrgb&w=1200'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

/**
 * Root layout component for the entire application
 */
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body className={`${inter.className} bg-gradient-to-br from-green-50 to-amber-50 min-h-screen`}>
        <AuthProvider session={session}>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <footer className="bg-amber-900 text-amber-100 py-8 mt-12">
              <div className="container mx-auto px-4 text-center">
                <p>&copy; 2024 Forest Blog. All rights reserved.</p>
                <p className="mt-2 text-sm text-amber-200">
                  Connecting nature lovers through stories
                </p>
              </div>
            </footer>
          </div>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}