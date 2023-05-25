/* Activate Email */

import jwt from 'jsonwebtoken';

import type { NextApiRequest, NextApiResponse } from 'next';

import User from '@/models/User';
import connectDB from '@/utils/connectDB';

const { ACTIVATION_TOKEN_SECRET } = process.env;

type UserToken = {
  id: string;
  iat: number;
  exp: number;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await connectDB();

    /* --- Get the token from activate page and activate the account */
    const { token } = req.body;
    const userToken = jwt.verify(
      token, 
      ACTIVATION_TOKEN_SECRET as string
    ) as UserToken;

    /* Check email is already verified and activate it */
    const userDB = await User.findById(userToken.id);

    if (!userDB) return res
      .status(400)
      .json({ message: 'This account no longer exist.' });

    if (userDB.emailVerified) return res
      .status(400)
      .json({ message: 'Email address already verified.' });

    await User.findByIdAndUpdate(userDB.id, { emailVerified: true });
  
    res
      .status(200)
      .json({ 
        message: 'Your Account has been successfully verified.'
      });
  }
  catch (error) {
    res
      .status(500)
      .json({ message: (error as Error).message });
  }
};