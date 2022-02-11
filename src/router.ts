import { Router, Response } from "express";

import { auth } from './middlewares/Auth';

import { Resp } from "./util/interfaces";

// Controllers
import { userController } from "./controllers/UserController";
import { postController } from "./controllers/PostController";

const router: Router = Router();

// Routes
// Home
router.get('/', (_, res: Response) => {
  const obj: Resp = {
    row: 'Hello TypeScript',
    status: 200
  }

  return res.status(obj.status).json(obj);
});

// User
router.post('/user/store', userController.store);
router.post('/user/login', userController.login);
router.put('/user/update/:id', auth, userController.update);
router.delete('/user/delete/:id', auth, userController.delete);
router.get('/user/:username', userController.getUserByUserName);

// Post
router.post('/post/store', auth, postController.store);

export { router };