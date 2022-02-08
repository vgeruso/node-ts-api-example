import { PrismaClient } from "@prisma/client";

import { Resp, User } from '../util/interfaces';
import { comparePass, encrypt } from '../util/crypt';
import { generateToken } from '../util/tokenOptions';

class UserRepository {
  public prisma: PrismaClient = new PrismaClient();

  public async store(name: string, email: string, password: string, username: string, bio: string) {
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

      if (!name || !email || !password || !username) {
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
          password: pass,
          username: `${username}`,
          bio: `${bio}`
        },
      });

      const user: User = {
        id: store.id,
        name: store.name,
        email: store.email,
        username: store.username,
        bio: store.bio
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

  public async getUserByUserName(username: string) {
    try {
      const found: any = await this.prisma.user.findUnique({
        where: {
          username: `${username}`
        }
      });

      if (!found) {
        return {
          row: 'User Not found',
          status: 404
        }
      }

      const user: User = {
        id: found.id,
        name: found.name,
        email: found.email,
        username: found.username,
        bio: found.bio
      }

      return {
        row: user,
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
        name: found.name,
        username: found.username,
        bio: found.bio
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

      if (!found) {
        return {
          row: 'User Not found',
          status: 404,
        }
      }

      let password;
      if (params.password) {
        const saltRounds = 10;
        password = await encrypt(params.password, saltRounds);
      }

      const passwordIsValid = await comparePass(passwordConfirm, found.password);

      if (!passwordIsValid) {
        return {
          row: 'Invalid password',
          status: 401
        }
      }

      const update: any = await this.prisma.user.updateMany({
        where: {
          id: Number(id)
        },
        data: {
          email: params.email,
          name: params.name,
          password,
          username: params.username,
          bio: params.bio
        }
      });

      return {
        row: {
          update,
          msg: 'Update user successfully'
        },
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

  public async delete(id: any, passwordConfirm: string) {
    try {
      const found: any = await this.prisma.user.findUnique({
        where: {
          id: Number(id)
        }
      });

      if (!found) {
        return {
          row: 'User Not found',
          status: 404
        }
      }

      const passwordIsValid = await comparePass(passwordConfirm, found.password);

      if (!passwordIsValid) {
        return {
          row: 'Invalid password',
          status: 401
        }
      }

      const deleted: any = await this.prisma.user.deleteMany({
        where: {
          id: Number(id)
        }
      });

      return {
        row: {
          deleted,
          msg: 'Delete user successfully'
        },
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
