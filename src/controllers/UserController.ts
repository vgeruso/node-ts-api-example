import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

import { Resp } from '../util/interfaces';

import { userRepository } from '../repositories/UserRepository';

class UserController {
  public prisma: PrismaClient = new PrismaClient();

  public async findAllUsers(_: any, res: Response) {
    const allUsers: Resp = await userRepository.findAllUsers();

    return res.status(allUsers.status).json(allUsers);
  }

  public async store(req: Request, res: Response) {
    const { name, email, password } = req.body;

    const storedUser: Resp = await userRepository.store(name, email, password);

    return res.status(storedUser.status).json(storedUser);
  }
}

export const userController = new UserController();