import { Request, Response } from 'express';

import { Resp } from '../util/interfaces';

import { postRepository } from '../repositories/PostRepository';

class PostController {
  public async store(req: Request, res: Response) {
    const response: Resp = await postRepository.store(req.body);

    return res.status(response.status).json(response);
  }
}

export const postController = new PostController();