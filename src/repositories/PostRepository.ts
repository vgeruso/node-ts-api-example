import { PrismaClient } from "@prisma/client";

import { Resp, Post } from '../util/interfaces';

class PostRepository {
  public prisma: PrismaClient = new PrismaClient();

  public async store(params: any) {
    try {
      if (
        !params.title ||
        !params.content ||
        !params.published ||
        !params.authorId
      ) {
        return {
          row: 'Post has incomplete informations',
          status: 400
        }
      }

      const store: any = await this.prisma.post.create({
        data: {
          createdAt: new Date(),
          updatedAt: new Date(),
          title: `${params.title}`,
          content: `${params.content}`,
          published: params.published,
          authorId: params.authorId
        }
      });

      const post: Post = {
        id: store.id,
        createdAt: store.createdAt,
        updatedAt: store.updatedAt,
        title: store.title,
        content: store.content,
        published: store.published,
        authorId: store.authorId
      };

      const resp: Resp = {
        row: post,
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

  public async getByAuthorId(authorId: number) {
    try {
      const user: any = await this.prisma.user.findUnique({
        where: {
          id: authorId
        }
      });

      if (!user) {
        return {
          row: 'Author not found',
          status: 404
        }
      }

      const posts: any = await this.prisma.post.findMany({
        where: {
          authorId
        }
      });

      return {
        row: {
          posts
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

  public async getById(id: number) {
    try {
      const post: any = await this.prisma.post.findUnique({
        where: {
          id
        },
        include: {
          author: true
        }
      });

      if (!post) {
        return {
          row: 'Post not found',
          status: 404
        }
      }

      post.author.password = undefined;
      post.author.bio = undefined;

      return {
        row: post,
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

  public async update(id: number, params: any) {
    try {
      const found: any = await this.prisma.post.findUnique({
        where: {
          id
        }
      });

      if (!found) {
        return {
          row: 'Post not found',
          status: 404
        }
      }

      const update: any = await this.prisma.post.updateMany({
        where: {
          id
        },
        data: {
          title: params.title,
          content: params.content,
          published: Boolean(params.publish)
        }
      });

      return {
        row: {
          update,
          msg: 'Update post successfully',
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

export const postRepository = new PostRepository();