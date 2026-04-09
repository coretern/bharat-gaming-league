import GoogleProvider from 'next-auth/providers/google';
import type { NextAuthOptions } from 'next-auth';
import { connectDB } from './db';
import { User } from '@/models/User';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: 'jwt' },
  callbacks: {
    async signIn({ user, account }) {
      // Save / update user in DB on every login
      try {
        await connectDB();
        await User.findOneAndUpdate(
          { email: user.email?.toLowerCase() },
          {
            $set: {
              name: user.name || '',
              image: user.image || '',
              provider: account?.provider || 'google',
              lastLoginAt: new Date(),
            },
            $setOnInsert: { firstLoginAt: new Date() },
            $inc: { loginCount: 1 },
          },
          { upsert: true, new: true }
        );
      } catch (err) {
        console.error('Failed to save user to DB:', err);
      }
      return true;
    },

    async jwt({ token, user, profile }) {
      const email = (
        token.email ||
        user?.email ||
        (profile as any)?.email ||
        ''
      ).toLowerCase();

      const adminEmail = (process.env.ADMIN_EMAIL || '').toLowerCase();
      if (email && adminEmail && email === adminEmail) {
        token.isAdmin = true;
      }
      if (email) token.email = email;
      if (user?.image) token.picture = user.image;
      if (user?.name) token.name = user.name;

      // ── Check if user still exists in DB ──
      // Only check when email is known (skip on first sign-in creation)
      if (email && !user) {
        try {
          await connectDB();
          const dbUser = await User.findOne({ email }).select('_id').lean();
          if (!dbUser) {
            token.deleted = true;
          }
        } catch {
          // On DB error, don't block — let session continue
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.sub;
        (session.user as any).isAdmin = token.isAdmin ?? false;
        (session.user as any).deleted = token.deleted ?? false;
        session.user.image = token.picture as string;
      }
      return session;
    },
  },
  pages: { signIn: '/login' },
};
