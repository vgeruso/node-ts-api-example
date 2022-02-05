import { PrismaClient } from "@prisma/client";

import { Resp, User } from '../util/interfaces';
import { encrypt } from '../util/crypt';

class UserRepository {
  public prisma: PrismaClient = new PrismaClient();

  public async findAllUsers() {
    try {
      const allUsers: any = await this.prisma.user.findMany();

      allUsers.forEach((element: any) => {
        element.password = undefined;
      });

      const resp: Resp = {
        row: allUsers,
        status: 200
      }

      return resp;
    } catch (err) {
      const error: Resp = {
        row: err,
        status: 500
      }

      return error;
    }
  }

  public async store(name: string, email: string, password: string) {
    try {
      const found: any = await this.prisma.user.findUnique({
        where: {
          email: `${email}`
        }
      });

      if (found) {
        return {
          row: 'User already exists',
          status: 406
        }
      }

      if (!name || !email || !password) {
        return {
          row: 'User has incomplete information',
          status: 400
        }
      }

      const saltRounds = 10;
      const pass = await encrypt(password, saltRounds);

      const store: any = await this.prisma.user.create({
        data: {
          name: `${name}`,
          email: `${email}`,
          password: pass
        },
      });

      const user: User = {
        name: store.name,
        email: store.email,
      }

      const resp: Resp = {
        row: user,
        status: 200
      }

      return resp;
    } catch (err) {
      const error: Resp = {
        row: err,
        status: 500
      }

      return error;
    }
  }
}

export const userRepository = new UserRepository();
