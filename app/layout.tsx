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
  title: 'The Venture Blog - Natural Stories & Insights',
  description: 'A beautiful blog platform for sharing stories from nature and life. Join our community of writers and readers.',
  keywords: ['blog', 'nature', 'stories', 'venture', 'writing', 'community'],
  authors: [{ name: 'The Venture Blog Team' }],
  creator: 'Rajesh',
  publisher: 'Rajesh',
  openGraph: {
    title: 'The Venture Blog - Stories & Insights',
    description: 'A beautiful blog platform for sharing stories from nature and life.',
    url: process.env.NEXTAUTH_URL,
    siteName: 'The Venture Blog',
    locale: 'en_US',
    type: 'website',
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
                <p>&copy; {new Date().getFullYear()} The Venture Blog. All rights reserved.</p>
                <p className="mt-2 text-sm text-amber-200">
                  Connecting everyone through stories
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
