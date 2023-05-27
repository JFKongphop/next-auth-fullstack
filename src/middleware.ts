/* Protect the route when account is not login */

import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";


export const middleware = async (req: NextRequest) => {
  const { pathname, origin } = req.nextUrl;
  const session = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
    secureCookie: process.env.NODE_ENV === 'production',
  });
  
  // when the session is null redirect the page to index for protect the route
  if (pathname === '/' || pathname.includes('/edit/')) {
    if (!session) return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/auth`);
  }

  // when valid of session then go to main page show the profile
  if (pathname === '/auth') {
    if (session) return NextResponse.redirect(`${origin}`);
  }
}