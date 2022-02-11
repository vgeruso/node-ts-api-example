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
}

export const postRepository = new PostRepository();