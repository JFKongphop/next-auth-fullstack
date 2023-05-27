/* Forgot password send email to user and link direct to page for reset pasword when click the button in email */

import User from '@/models/User';
import connectDB from '@/utils/connectDB';
import sendMail from '@/utils/sendMail';
import { createResetToken } from '@/utils/jwt';
import { resetPasswordEmail } from '@/emailTemplates/reset';

import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await connectDB();

    /* --- Get the token from activate page and activate the account */
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res
      .status(400)
      .json({ message: 'This email dose not exist.'});

    const userId = createResetToken({
      id: user._id.toString()
    });
    const url: string = `${process.env.NEXTAUTH_URL}/reset/${userId}`;

    await sendMail(
      email,
      user.name,
      user.image,
      url,
      "Reset your password.",
      resetPasswordEmail
    );

    res
      .status(200)
      .json({ 
        message: 'An email has beern sent to you, use it to reset your password.'
      });
  }
  catch (error) {
    res
      .status(500)
      .json({ message: (error as Error).message });
  }
};