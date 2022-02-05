import { Request, Response } from 'express';

import { Resp } from '../util/interfaces';

import { userRepository } from '../repositories/UserRepository';

class UserController {
  public async findAllUsers(_: any, res: Response) {
    const response: Resp = await userRepository.findAllUsers();

    return res.status(response.status).json(response);
  }

  public async store(req: Request, res: Response) {
    const { name, email, password } = req.body;
    const response: Resp = await userRepository.store(name, email, password);

    return res.status(response.status).json(response);
  }
}

export const userController = new UserController();