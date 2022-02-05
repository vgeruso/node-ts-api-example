import { Router, Response } from "express";

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
router.get('/user/list', userController.findAllUsers);

export { router };