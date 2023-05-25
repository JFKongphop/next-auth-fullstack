/* Create activate email and reset password email to send the token of user when we want to do it */

import jwt from 'jsonwebtoken';
const { 
  ACTIVATION_TOKEN_SECRET,
  RESET_TOKEN_SECRET
} = process.env

export const createActivationToken = (payload: any) => {
  return jwt.sign(payload, ACTIVATION_TOKEN_SECRET as string, {
    expiresIn: '2d'
  });
}

export const createResetToken = (payload: any) => {
  return jwt.sign(payload, RESET_TOKEN_SECRET as string, {
    expiresIn: '6h'
  });
}