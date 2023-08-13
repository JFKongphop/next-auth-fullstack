import User from "@/models/User";
import connectDB from "@/utils/connectDB";
import { generateRandomString } from "@/utils/randomString";

import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler (
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await connectDB();

    const { address } = req.body;

    const user = await User.findOne({ name: address });

    if (!user) {
      const newUser = new User({
        name: address,
        phone: generateRandomString(30),
        email: generateRandomString(30),
        password: generateRandomString(30)
      });

      await newUser.save();
    }
    
    else {
      return res
        .status(400)
        .json({ message: 'This account is already exist.' });
    }

    res
      .status(200)
      .json({ message: 'done' }); 
  }
  catch (error) {
    res
      .status(500)
      .json({ message: (error as Error).message });
  }
}