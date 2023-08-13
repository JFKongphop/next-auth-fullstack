/* Activate Email */

import jwt from 'jsonwebtoken';

import type { NextApiRequest, NextApiResponse } from 'next';

import User from '@/models/User';
import connectDB from '@/utils/connectDB';
import { activateTemplateEmail } from '@/emailTemplates/activate';
import sendMail from '@/utils/sendMail';


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await connectDB();

    /* --- Get the token from activate page and activate the account */
    const { address } = req.body;
    /* Check email is already verified and activate it */
    const userDB = await User.findOne({ name: address });

    if (!userDB) return res
      .status(400)
      .json({ message: 'This account no longer exist.' });

    if (userDB.emailVerified) return res
      .status(400)
      .json({ message: 'Email address already verified.' });

    await User.findByIdAndUpdate(userDB.id, { 
      emailVerified: true 
    });
  
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