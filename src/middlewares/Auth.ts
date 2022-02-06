import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  const secret: any = process.env.SECRET;

  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(403).json({ msg: 'Token required' });
  }

  try {
    await jwt.verify(token, secret);
    next();
  } catch (err) {
    return res.status(401).json({ msg: 'Invalid Token' });
  }
};