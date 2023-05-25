/* Login Account */

import bcrypt from 'bcryptjs';
import NextAuth, { Account, Profile, User as UserNext } from "next-auth";

import Auth0Provider from "next-auth/providers/auth0";
import CredentialsProvider from "next-auth/providers/credentials";
import DiscordProvider from "next-auth/providers/discord";
import FacebookProvider from "next-auth/providers/facebook";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import TwitterProvider from "next-auth/providers/twitter";

import { MongoDBAdapter } from "@next-auth/mongodb-adapter"
import clientPromise from "@/lib/mongodb";
import { JWT } from "next-auth/jwt";
import { Adapter } from "next-auth/adapters";
import connectDB from "@/utils/connectDB";
import User from '@/models/User';

export default NextAuth({
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { 
          label: "Name", 
          type: "text"
        },
        password: { 
          label: "Password", 
          type: "password" 
        }
      },

      /* Connect database to sign in with the account is exist */
      async authorize(credentials, req) {
        await connectDB();

        const user = await User.findOne({ email: credentials!.email });
  
        if (!user) throw new Error('Email is not registered.');

        const isPasswordCorrect = await bcrypt.compare(
          credentials!.password,
          user.password
        );

        if (!isPasswordCorrect) throw new Error('Password is incorrect.');

        return user;
      }
    }),

    /* Provider Platform */
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),  
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID as string,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID as string,
      clientSecret: process.env.DISCORD_CLIENT_SECRET as string,
    }),
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID as string,
      clientSecret: process.env.TWITTER_CLIENT_SECRET as string,
    }),
    Auth0Provider({
      clientId: process.env.AUTH0_CLIENT_ID as string,
      clientSecret: process.env.AUTH0_CLIENT_SECRET as string,
      issuer: process.env.AUTH0_ISSUER as string,
    })
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/auth'
  },
  /* change the structure of session token */
  callbacks: {
    async jwt({ 
      token, 
      user, 
      account, 
      profile, 
      isNewUser 
    }: {
      token: JWT,
      user?: UserNext | Adapter | undefined,
      account?: Account | null | undefined,
      profile?: Profile | undefined,
      isNewUser?: boolean | undefined
    }) {
      if (user) {
        // add the domain to sign in to token
        token.provider = account?.provider;
      }

      return token;
    },
    async session({ 
      session,
      token 
    } : {
      session: any,
      token: JWT
    }) {
      if (session.user) {
        session.user.provider = token.provider;
      }
      return session
    },
  }
});
