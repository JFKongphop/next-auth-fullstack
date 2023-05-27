/* Edit user profile to database  */
import jwt from 'jsonwebtoken';

import type { NextApiRequest, NextApiResponse } from 'next';

import User from '@/models/User';
import connectDB from '@/utils/connectDB';

const { EDIT_TOKEN_SECRET } = process.env;

export type UserToken = {
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

    /* --- Get the token and password to sign the acount */
    const { 
      token,
      firstname,
      lastname,
      phone
    } = req.body;
    const userToken = jwt.verify(
      token,
      EDIT_TOKEN_SECRET!
    ) as UserToken;

    /* Check user is exist */
    const user = await User.findById(userToken.id);
    if (!user) return res
      .status(400)
      .json({ message: 'This account no longer exist.' });
    
    /* Edit user profile */
    const name = `${firstname} ${lastname}`
    await User.findByIdAndUpdate(user.id, {
      name,
      phone
    })

    res
      .status(200)
      .json({ 
        message: 'Your profile has been successfully updated.'
      });
  }
  catch (error) {
    res
      .status(500)
      .json({ message: (error as Error).message });
  }
};