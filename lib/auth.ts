import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import connectToDatabase from './mongodb';
import User from './models/User';

/**
 * NextAuth configuration options
 */
export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    /**
     * Handle user sign in and database creation
     */
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        try {
          await connectToDatabase();
          
          const existingUser = await User.findOne({ email: user.email });
          
          if (!existingUser) {
            await User.create({
              email: user.email,
              name: user.name,
              image: user.image,
              role: 'user',
            });
          } else {
            // Update last login
            existingUser.lastLogin = new Date();
            await existingUser.save();
          }
          
          return true;
        } catch (error) {
          console.error('Error during sign in:', error);
          return false;
        }
      }
      return true;
    },
    /**
     * Add user role to session
     */
    async session({ session, token }) {
      if (session.user?.email) {
        await connectToDatabase();
        const user = await User.findOne({ email: session.user.email });
        if (user) {
          session.user.role = user.role;
          session.user.id = user._id.toString();
        }
      }
      return session;
    },
    /**
     * Add user info to JWT token
     */
    async jwt({ token, user }) {
      if (user) {
        await connectToDatabase();
        const dbUser = await User.findOne({ email: user.email });
        if (dbUser) {
          token.role = dbUser.role;
          token.id = dbUser._id.toString();
        }
      }
      return token;
    },
  },
  pages: {
    signIn: '/auth',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
};