import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import type { NextAuthOptions } from 'next-auth';
import { connectDB } from './db';
import { User } from '@/models/User';
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        idToken: { label: "IdToken", type: "text" }
      },
      async authorize(credentials) {
        await connectDB();

        // Check if signing in with a Google ID Token (One Tap or client-rendered button)
        if (credentials?.idToken) {
          try {
            const verifyRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${credentials.idToken}`);
            if (!verifyRes.ok) {
              throw new Error('INVALID_GOOGLE_TOKEN');
            }
            const payload = await verifyRes.json();
            const email = payload.email?.toLowerCase();
            if (!email) {
              throw new Error('NO_EMAIL_IN_TOKEN');
            }

            let user = await User.findOne({ email });
            if (user?.isBanned) {
              throw new Error('BAN_ACTIVE');
            }

            if (!user) {
              user = await User.create({
                email,
                name: payload.name || email.split('@')[0],
                image: payload.picture || '',
                provider: 'google',
                firstLoginAt: new Date(),
                lastLoginAt: new Date(),
                loginCount: 1,
              });
            } else {
              await User.updateOne(
                { email },
                {
                  $set: {
                    name: user.name || payload.name || '',
                    image: user.image || payload.picture || '',
                    provider: 'google',
                    lastLoginAt: new Date(),
                  },
                  $inc: { loginCount: 1 }
                }
              );
            }

            return {
              id: user._id.toString(),
              name: user.name,
              email: user.email,
              image: user.image || '',
            };
          } catch (err: any) {
            console.error('Google One Tap verification failed:', err);
            throw new Error(err.message || 'GOOGLE_ONE_TAP_FAILED');
          }
        }

        if (!credentials?.email || !credentials?.password) {
          throw new Error('MISSING_CREDENTIALS');
        }
        const email = credentials.email.toLowerCase();
        const user = await User.findOne({ email });
        if (!user) {
          throw new Error('USER_NOT_FOUND');
        }
        if (!user.password) {
          throw new Error('GOOGLE_LOGIN_REQUIRED');
        }
        if (user.isBanned) {
          throw new Error('BAN_ACTIVE');
        }
        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) {
          throw new Error('INVALID_PASSWORD');
        }
        return {
          id: user._id.toString(),
          name: user.name || user.email.split('@')[0],
          email: user.email,
          image: user.image || '',
        };
      }
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: 'jwt' },
  callbacks: {
    async signIn({ user, account }) {
      try {
        await connectDB();
        const email = user.email?.toLowerCase();
        
        // Find user first to check ban status
        const existingUser = await User.findOne({ email });
        if (existingUser?.isBanned) {
          throw new Error('BAN_ACTIVE');
        }

        if (account?.provider === 'credentials') {
          if (existingUser) await User.updateOne({ email }, { $set: { lastLoginAt: new Date() }, $inc: { loginCount: 1 } });
          return true;
        }

        await User.findOneAndUpdate(
          { email },
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
      } catch (err: any) {
        if (err.message === 'BAN_ACTIVE') throw err;
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

      // ── Check user status in DB ──
      if (email) {
        try {
          await connectDB();
          const dbUser = await User.findOne({ email }).select('_id isBanned role').lean();
          if (!dbUser) {
            token.deleted = true;
          } else {
            if (dbUser.isBanned) {
              token.banned = true;
            }
            if (dbUser.role === 'admin') {
              token.isAdmin = true;
            }
          }
        } catch {
          // On DB error, don't block
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.sub;
        (session.user as any).isAdmin = token.isAdmin ?? false;
        (session.user as any).deleted = token.deleted ?? false;
        (session.user as any).isBanned = token.banned ?? false;
        session.user.image = token.picture as string;
      }
      return session;
    },
  },
  pages: { signIn: '/login' },
};
