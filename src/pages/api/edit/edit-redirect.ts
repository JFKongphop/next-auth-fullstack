/* Redirect to edit page by token */

import User from '@/models/User';
import connectDB from '@/utils/connectDB';
import { createEditToken } from '@/utils/jwt';

import type { NextApiRequest, NextApiResponse } from 'next';


export default async function edit(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await connectDB();
    const { email } = req.body;
    console.log(email);

    const user = await User.findOne({ email });

    if (!user) return res
    .status(400)
    .json({ message: 'This email dose not exist.'});

    const userToken = createEditToken({
      id: user._id.toString()
    });

    res
      .status(200)
      .json({
        message: 'Completed to redirect to edit page',
        token: userToken
      });

  }
  catch (error) {
    res
    .status(500)
    .json({ message: (error as Error).message });
  }
}
