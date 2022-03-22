import { Request, Response } from 'express';

import { Resp } from '../util/interfaces';

import { postRepository } from '../repositories/PostRepository';

class PostController {
  public async store(req: Request, res: Response) {
    const response: Resp = await postRepository.store(req.body);

    return res.status(response.status).json(response);
  }

  public async getByAuthId(req: Request, res: Response) {
    const response: Resp = await postRepository.getByAuthorId(Number(req.params.authorId));

    return res.status(response.status).json(response);
  }

  public async getById(req: Request, res: Response) {
    const response: Resp = await postRepository.getById(Number(req.params.id));

    return res.status(response.status).json(response);
  }

  public async update(req: Request, res: Response) {
    const response: Resp = await postRepository.update(Number(req.params.id), req.body);

    return res.status(response.status).json(response);
  }

  public async delete(req: Request, res: Response) {
    const response: Resp = await postRepository.delete(Number(req.params.id));

    return res.status(response.status).json(response);
  }
}

export const postController = new PostController();