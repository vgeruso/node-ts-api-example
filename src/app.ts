import express from 'express';
import dotenv from 'dotenv';

import { router } from './router';
export class App {
  public server: express.Application;

  constructor() {
    dotenv.config();
    this.server = express();
    this.middleware();
    this.router();
  }

  private middleware() {
    this.server.use(express.json());
  }

  private router() {
    this.server.use('/api', router);
  }
}