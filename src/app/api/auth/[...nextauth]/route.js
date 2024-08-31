import { PrismaClient } from '@prisma/client';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const prisma = new PrismaClient();

export default NextAuth({
  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        if (user && user.password === credentials.password) {
          return user;
        }
        return null;
      }
    })
  ],
  pages: {
    signIn: '/auth/signin'
  },
  callbacks: {
    async session({ session, user }) {
      session.user = user;
      return session;
    }
  }
});
