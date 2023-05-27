/* Reset password when click the email to this page and update new password */

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import User from '@/models/User';
import connectDB from '@/utils/connectDB';

import type { NextApiRequest, NextApiResponse } from 'next';

const { RESET_TOKEN_SECRET } = process.env;

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
    const { password, token } = req.body;
    const userToken = jwt.verify(
      token, 
      RESET_TOKEN_SECRET!
    ) as UserToken;

    /* Check email is already verified and activate it */
    const userDB = await User.findById(userToken.id);

    if (!userDB) return res
      .status(400)
      .json({ message: 'This account no longer exist.' });


    /* Check same password of old password */
    const samePassword = await bcrypt.compare(
      password,
      userDB.password
    );
    if (samePassword) return res
      .status(400)
      .json({ message: 'New password is same as old password.' });


    /* Create new hash password to change new password */
    const cryptedPassword = await bcrypt.hash(password, 12)

    await User.findByIdAndUpdate(userDB.id, { password: cryptedPassword });
  
    res
      .status(200)
      .json({ 
        message: 'Your Account password has been successfully updated.'
      });
  }
  catch (error) {
    res
      .status(500)
      .json({ message: (error as Error).message });
  }
};