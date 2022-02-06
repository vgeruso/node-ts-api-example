import { PrismaClient } from "@prisma/client";

import { Resp, User } from '../util/interfaces';
import { comparePass, encrypt } from '../util/crypt';
import { generateToken } from '../util/tokenOptions';

class UserRepository {
  public prisma: PrismaClient = new PrismaClient();

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
        id: store.id,
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

  public async login(email: string, password: string) {
    try {
      const found: any = await this.prisma.user.findUnique({
        where: {
          email: `${email}`
        }
      });

      if (!found) {
        return {
          row: 'User not found',
          status: 404
        }
      }

      const passwordIsValid = await comparePass(password, found.password);

      if (!passwordIsValid) {
        return {
          row: 'incorrect user password',
          status: 401
        }
      }

      const token = await generateToken({
        email: found.email,
        name: found.name
      }, process.env.SECRET, "24h");

      const user: User = {
        id: found.id,
        email: found.email,
        name: found.name
      }

      return {
        row: {
          user,
          token
        },
        status: 200
      };
    } catch (err) {
      const error: Resp = {
        row: err,
        status: 500
      }

      return error;
    }
  }

  public async update(id: any, params: any, passwordConfirm: string) {
    try {
      const found: any = await this.prisma.user.findUnique({
        where: {
          id: Number(id)
        }
      });

      let password;
      if (params.password) {
        const saltRounds = 10;
        password = await encrypt(params.password, saltRounds);
      }

      const update: any = await this.prisma.user.updateMany({
        where: {
          id: Number(id)
        },
        data: {
          email: params.email,
          name: params.name,
          password
        }
      });

      const passwordIsValid = await comparePass(passwordConfirm, found.password);

      if (!passwordIsValid) {
        return {
          row: 'Invalid password',
          status: 401
        }
      }

      return {
        row: update,
        status: 200
      }
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
