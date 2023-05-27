/* Fetching profile to edit */

import jwt from 'jsonwebtoken';

import User from '@/models/User';
import connectDB from '@/utils/connectDB';

import type { UserDefault } from '@/components/forms/Edit';
import type { NextApiRequest, NextApiResponse } from 'next'
import type { UserToken } from '../auth/reset';

export default async function profile(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await connectDB();

    const { token } = req.body;

    const userToken = jwt.verify(
      token,
      process.env.EDIT_TOKEN_SECRET!
    ) as UserToken


    const user = await User.findById(userToken.id);

    if (!user) return res
      .status(400)
      .json({ message: 'This account no longer exist.' });
    
    const name: string = user.name.split(' ');
    const userData: UserDefault = {
      firstname: name[0],
      lastname: name[1],
      phone: user.phone
    }

    // console.log(userData)

    res.status(200).json(userData)
  } 
  catch (error) {
    res
      .status(500)
      .json({ message: (error as Error).message });
  }
}