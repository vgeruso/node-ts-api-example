import { Request, Response } from 'express';

import { Resp } from '../util/interfaces';

import { userRepository } from '../repositories/UserRepository';

class UserController {
  public async store(req: Request, res: Response) {
    const { name, email, password, username, bio } = req.body;
    const response: Resp = await userRepository.store(name, email, password, username, bio);

    return res.status(response.status).json(response);
  }

  public async getUserByUserName(req: Request, res: Response) {
    const { username } = req.params;
    const response: Resp = await userRepository.getUserByUserName(username);

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

  public async delete(req: Request, res: Response) {
    const { id } = req.params;
    const response: Resp = await userRepository.delete(id, req.body.passwordConfirm);

    return res.status(response.status).json(response);
  }
}

export const userController = new UserController();