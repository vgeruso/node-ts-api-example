import { Router, Response } from "express";

import { auth } from './middlewares/Auth';

// Controllers
import { userController } from "./controllers/UserController";

const router: Router = Router();

// Routes
// Home
router.get('/', (_, res: Response) => {
  const obj: Object = {
    msg: 'Hello TypeScript',
    status: 200
  }

  return res.json(obj);
});

// User
router.post('/user/store', userController.store);
router.post('/user/login', userController.login);
router.put('/user/update/:id', auth, userController.update);
router.delete('/user/delete/:id', auth, userController.delete);
router.get('/user/:username', userController.getUserByUserName);

export { router };