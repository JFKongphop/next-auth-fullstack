
/* Edit user profile to database  */
import jwt from 'jsonwebtoken';

import type { NextApiRequest, NextApiResponse } from 'next';

import User from '@/models/User';
import connectDB from '@/utils/connectDB';
import cloudinary from '@/utils/cloudinaryConfig';

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
      phone,
      image,
      oldUrl
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

    /* Upload image to cloudinary */
    const name = `${firstname} ${lastname}`
    if (image) {
      const newImage = await cloudinary.uploader.upload(image, {
        folder: 'profile-upload',
        public_id: (Date.now()).toString(),
        crop: 'scale'
      });

      /* Edit user profile with image */
      if (!(
        user.image === 
        'https://res.cloudinary.com/dmhcnhtng/image/upload/v1664642479/992490_sskqn3.png'
        || (!user.image.includes(oldUrl))
      )) await cloudinary.uploader.destroy(oldUrl);

      await User.findByIdAndUpdate(user.id, {
        name,
        phone,
        image: newImage.url
      });
    }

    else {
      /* Edit user profile without image */
      await User.findByIdAndUpdate(user.id, {
        name,
        phone,
      });
    }

    res
      .status(200)
      .json({ 
        message: 'Your profile has been successfully updated.'
      });
  }
  catch (error) {
    console.log(error)
    res
      .status(500)
      .json({ message: (error as Error).message });
  }
};