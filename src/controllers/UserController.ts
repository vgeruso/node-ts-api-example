import { Request, Response } from 'express';

import { Resp } from '../util/interfaces';

import { userRepository } from '../repositories/UserRepository';

class UserController {
  public async store(req: Request, res: Response) {
    const { name, email, password } = req.body;
    const response: Resp = await userRepository.store(name, email, password);

    return res.status(response.status).json(response);
  }

  public async login(req: Request, res: Response) {
    const { email, password } = req.body;
    const response: Resp = await userRepository.login(email, password);

    return res.status(response.status).json(response);
  }

  public async update(req: Request, res: Response) {
    const { id } = req.params;
    const response: Resp = await userRepository.update(id, req.body, req.body.passwordConfirm);

    return res.status(response.status).json(response);
  }
}

export const userController = new UserController();