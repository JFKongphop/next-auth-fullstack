import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    address: string;
    expires: string;
    user: {
      image: string;
      name: string;
    }
  }
}