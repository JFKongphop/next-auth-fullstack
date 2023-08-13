/* Login Account */

import NextAuth from "next-auth";

import CredentialsProvider from "next-auth/providers/credentials";

import { MongoDBAdapter } from "@next-auth/mongodb-adapter"
import clientPromise from "@/lib/mongodb";
import connectDB from "@/utils/connectDB";
import User from '@/models/User';
import { SiweMessage } from "siwe";

export default NextAuth({
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    CredentialsProvider({
      name: "Ethereum",
      credentials: {
        message: {
          label: "Message",
          type: "text",
          placeholder: "0x0",
        },
        signature: {
          label: "Signature",
          type: "text",
          placeholder: "0x0",
        },
      },
      async authorize(credentials) {
        await connectDB();
        try {
          const messageToObject = JSON.parse(credentials?.message || "{}");
          const siwe = new SiweMessage(messageToObject);
          const nextAuthUrl = new URL(process.env.NEXTAUTH_URL!)

          const address  = messageToObject.address;
          console.log(address);
          const user = await User.findOne({ address })

          const result = await siwe.verify({
            signature: credentials?.signature || "",
            domain: nextAuthUrl.host,
            //nonce: await getCsrfToken({ req }),
          })

          if (result.success) {
            return {
              id: siwe.address,
            }
          }
          return null
        } catch (e) {
          return null
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60 * 3
  },
  /* change the structure of session token */
  callbacks: {
    async session({ session, token }: { session: any; token: any }) {
      session.address = token.sub
      session.user.name = token.sub
      session.user.image = "https://www.fillmurray.com/128/128"
      return session
    },
  },
});
