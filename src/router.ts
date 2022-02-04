import { Router, Request, Response } from "express";

// Controllers
import { userController } from "./controllers/UserController";

const router: Router = Router();

// Routes
router.get('/', (_, res: Response) => {
  const obj: Object = {
    msg: 'Hello TypeScript',
    status: 200
  }

  return res.json(obj);
});

router.get('/user/list', userController.findAllUsers);
router.post('/user/store', userController.store);

export { router };