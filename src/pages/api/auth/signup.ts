/* Register account */

import User from '@/models/User';
import connectDB from '@/utils/connectDB';
import type { NextApiRequest, NextApiResponse } from 'next';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import { createActivationToken } from '@/utils/jwt';
import sendMail from '@/utils/sendMail';
import { activateTemplateEmail } from '@/emailTemplates/activate';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await connectDB();
  
    const {
      firstname,
      lastname,
      email,
      phone,
      password,
    } = req.body;
  

    /* --- Checking stage of body data */
    if (
      !firstname ||
      !lastname ||
      !email ||
      !phone ||
      !password
    ) return res
        .status(400)
        .json({ message: 'Please fill in all fields.' });
  
    if (!validator.isEmail(email)) 
      return res
        .status(400)
        .json({ message: 'Please add a valid email address.'});
  
    if (!validator.isMobilePhone(phone)) 
      return res
        .status(400)
        .json({ message: 'Please add a valid phone number'});
  
    const user = await User.findOne({
      email: email
    });
  
    if (user)
      return res
        .status(400)
        .json({ message: 'This account is already exist.' });
    
    if (password.length < 6) 
      return res
        .status(400)
        .json({ message: 'Password must be at least 6 characters' });
  

    /* --- Push new user to database */
    const cryptedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({
      name: `${firstname} ${lastname}`,
      email,
      phone,
      password: cryptedPassword,
    });
    await newUser.save();

  
    /* 
      Activate email user after created new user
      Send the email then click the mail that direct to page to activate
    */
    const activationToken = createActivationToken({
      id: newUser._id.toString(),
    });
    const url = `${process.env.NEXTAUTH_URL}/activate/${activationToken}`;
    await sendMail(
      newUser.email,
      newUser.name,
      "",
      url,
      "Activate your account",
      activateTemplateEmail
    );
  
    res
      .status(200)
      .json({ 
        message: 'Register success! Please activate your account to start.'
      });
  }
  catch (error) {
    res
      .status(500)
      .json({ message: (error as Error).message });
  }
};