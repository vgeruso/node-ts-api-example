import supertest from "supertest";
import faker from '@faker-js/faker';

import {
  truncatePost,
  truncateUser
} from '../util/truncate';

import { App } from '../../src/app';

const app = new App().server;

const title = faker.lorem.slug();
const content = faker.lorem.text();
const published = true;

const password = faker.internet.password();

let user: any;
let token: any;
let post: any;

describe('Post', () => {
  beforeAll(async () => {
    await truncatePost();
    await truncateUser();

    const name = faker.name.findName();

    const userStored = await supertest(app)
      .post('/api/user/store')
      .send({
        name,
        email: faker.internet.email(name),
        username: faker.internet.userName(name),
        bio: faker.lorem.slug(),
        password
      });

    user = userStored.body.row;

    const userLogged = await supertest(app)
      .post('/api/user/login')
      .send({
        email: userStored.body.row.email,
        password
      });

    token = userLogged.body.row.token;
  });

  it('should store post', async () => {
    const { status, body } = await supertest(app)
      .post('/api/post/store')
      .set('Authorization', `bearer ${token}`)
      .send({
        title,
        content,
        published,
        authorId: user.id
      });

    const { row } = body;

    post = row;

    expect(status).toBe(200);
    expect(typeof row).toBe('object');
    expect(row.title).toBe(title);
    expect(row.content).toBe(content);
    expect(row.published).toBe(published);
    expect(row.authorId).toBe(user.id);
  });

  it('should not authorized store post (Token required)', async () => {
    const { status, body } = await supertest(app)
      .post('/api/post/store')
      .send({
        title,
        content,
        published,
        authorId: user.id
      });

    const { msg } = body;

    expect(status).toBe(403);
    expect(typeof msg).toBe('string');
    expect(msg).toBe('Token required');
  });

  it('should not authorized store post (Invalid Token)', async () => {
    const { status, body } = await supertest(app)
      .post('/api/post/store')
      .set('Authorization', `bearer falskd`)
      .send({
        title,
        content,
        published,
        authorId: user.id
      });

    const { msg } = body;

    expect(status).toBe(401);
    expect(typeof msg).toBe('string');
    expect(msg).toBe('Invalid Token');
  });

  it('should not store post incomplete informations (title)', async () => {
    const { status, body } = await supertest(app)
      .post('/api/post/store')
      .set('Authorization', `bearer ${token}`)
      .send({
        content,
        published,
        authorId: user.id
      });

    const { row } = body;

    expect(status).toBe(400);
    expect(typeof row).toBe('string');
    expect(row).toBe('Post has incomplete informations');
  });

  it('should not store post incomplete informations (content)', async () => {
    const { status, body } = await supertest(app)
      .post('/api/post/store')
      .set('Authorization', `bearer ${token}`)
      .send({
        title,
        published,
        authorId: user.id
      });

    const { row } = body;

    expect(status).toBe(400);
    expect(typeof row).toBe('string');
    expect(row).toBe('Post has incomplete informations');
  });

  it('should not store post incomplete informations (published)', async () => {
    const { status, body } = await supertest(app)
      .post('/api/post/store')
      .set('Authorization', `bearer ${token}`)
      .send({
        title,
        content,
        authorId: user.id
      });

    const { row } = body;

    expect(status).toBe(400);
    expect(typeof row).toBe('string');
    expect(row).toBe('Post has incomplete informations');
  });

  it('should not store post incomplete informations (authorId)', async () => {
    const { status, body } = await supertest(app)
      .post('/api/post/store')
      .set('Authorization', `bearer ${token}`)
      .send({
        title,
        content,
        published
      });

    const { row } = body;

    expect(status).toBe(400);
    expect(typeof row).toBe('string');
    expect(row).toBe('Post has incomplete informations');
  });

  it('should get post by authorId', async () => {
    const { status, body } = await supertest(app)
      .get(`/api/post/getByAuthorId/${user.id}`)
      .set('Authorization', `bearer ${token}`);

    const { row } = body;

    expect(status).toBe(200);
    expect(typeof row.posts).toBe('object');
    expect(row.posts.length).toBe(1);
    expect(row.posts[0].title).toBe(post.title);
    expect(row.posts[0].content).toBe(post.content);
    expect(row.posts[0].published).toBe(post.published);
    expect(row.posts[0].createdAt).toBe(post.createdAt);
    expect(row.posts[0].updatedAt).toBe(post.updatedAt);
  });

  it('should not get post by authorId (Author not found)', async () => {
    const { status, body } = await supertest(app)
      .get(`/api/post/getByAuthorId/000`)
      .set('Authorization', `bearer ${token}`);

    const { row } = body;

    expect(status).toBe(404);
    expect(typeof row).toBe('string');
    expect(row).toBe('Author not found');
  });

  it('should get post by id', async () => {
    const { status, body } = await supertest(app)
      .get(`/api/post/getById/${post.id}`);

    const { row } = body;

    expect(status).toBe(200);
    expect(typeof row).toBe('object');
    expect(row.title).toBe(post.title);
    expect(row.content).toBe(post.content);
    expect(row.published).toBe(post.published);
    expect(row.createdAt).toBe(post.createdAt);
    expect(row.updatedAt).toBe(post.updatedAt);
    expect(row.author.id).toBe(user.id);
    expect(row.author.email).toBe(user.email);
    expect(row.author.username).toBe(user.username);
    expect(row.author.name).toBe(user.name);
    expect(row.author.password).toBe(undefined);
    expect(row.author.bio).toBe(undefined);
  });

  it('should not get post by id (Post not found)', async () => {
    const { status, body } = await supertest(app)
      .get(`/api/post/getById/000`);

    const { row } = body;

    expect(status).toBe(404);
    expect(typeof row).toBe('string');
    expect(row).toBe('Post not found');
  });

  it('should update post by id title', async () => {
    const { status, body } = await supertest(app)
      .put(`/api/post/update/${post.id}`)
      .set('Authorization', `bearer ${token}`)
      .send({
        title: 'titulo teste'
      });

    const { row } = body;

    expect(status).toBe(200);
    expect(typeof row.msg).toBe('string');
    expect(row.update.count).toBe(1);
    expect(row.msg).toBe('Update post successfully');
  });

  it('should update post by id content', async () => {
    const { status, body } = await supertest(app)
      .put(`/api/post/update/${post.id}`)
      .set('Authorization', `bearer ${token}`)
      .send({
        content: 'conteúdo teste'
      });

    const { row } = body;

    expect(status).toBe(200);
    expect(typeof row.msg).toBe('string');
    expect(row.update.count).toBe(1);
    expect(row.msg).toBe('Update post successfully');
  });

  it('should update post by id publish', async () => {
    const { status, body } = await supertest(app)
      .put(`/api/post/update/${post.id}`)
      .set('Authorization', `bearer ${token}`)
      .send({
        publish: false
      });

    const { row } = body;

    expect(status).toBe(200);
    expect(typeof row.msg).toBe('string');
    expect(row.update.count).toBe(1);
    expect(row.msg).toBe('Update post successfully');
  });

  it('should not authorized update post (Token required)', async () => {
    const { status, body } = await supertest(app)
      .put(`/api/post/update/${post.id}`)
      .send({
        title: 'titulo teste',
      });

    const { msg } = body;

    expect(status).toBe(403);
    expect(typeof msg).toBe('string');
    expect(msg).toBe('Token required');
  });

  it('should not authorized update post (Invalid Token)', async () => {
    const { status, body } = await supertest(app)
      .put(`/api/post/update/${post.id}`)
      .set('Authorization', `bearer falskd`)
      .send({
        title: 'titulo teste'
      });

    const { msg } = body;

    expect(status).toBe(401);
    expect(typeof msg).toBe('string');
    expect(msg).toBe('Invalid Token');
  });

  it('should not update post by id (Post not found)', async () => {
    const { status, body } = await supertest(app)
      .put(`/api/post/update/000`)
      .set('Authorization', `bearer ${token}`)
      .send({
        title: 'titulo teste'
      });

    const { row } = body;

    expect(status).toBe(404);
    expect(typeof row).toBe('string');
    expect(row).toBe('Post not found');
  });

  it('should not delete post (Post not found)', async () => {
    const {status, body} = await supertest(app)
      .delete(`/api/post/delete/000`)
      .set('Authorization', `bearer ${token}`);
    
      const {row} = body;

      expect(status).toBe(404);
      expect(typeof row).toBe('string');
      expect(row).toBe('Post not found');
  });

  it('should delete post', async () => {
    const {status, body} = await supertest(app)
      .delete(`/api/post/delete/${post.id}`)
      .set('Authorization', `bearer ${token}`);
    
    const {row} = body;

    expect(status).toBe(200);
    expect(typeof row.msg).toBe('string');
    expect(row.update.count).toBe(1);
    expect(row.msg).toBe('Update post successfully');
  });
});