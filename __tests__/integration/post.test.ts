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

    expect(status).toBe(200);
    expect(row.title).toBe(title);
    expect(row.content).toBe(content);
    expect(row.published).toBe(published);
    expect(row.authorId).toBe(user.id);
  });

  it('should not authorized update user (Token required)', async () => {
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
    expect(msg).toBe('Token required');
  });

  it('should not authorized update user (Invalid Token)', async () => {
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
    expect(row).toBe('Post has incomplete informations');
  });
});