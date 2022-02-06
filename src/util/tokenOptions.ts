import jwt from 'jsonwebtoken';

export const generateToken = async (payload: Object, secret: any, expiresIn: string) => {
  return await jwt.sign(payload, secret, { expiresIn });
}