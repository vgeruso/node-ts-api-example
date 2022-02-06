import supertest from "supertest";
import faker from '@faker-js/faker';

import {
  truncatePost,
  truncateProfile,
  truncateUser
} from '../util/truncate';

import { App } from '../../src/app';
const app = new App().server;

const name = faker.name.findName();
const email = faker.internet.email(name);
const password = faker.internet.password();

let token: any;
let id: any;

describe('User', () => {
  beforeAll(async () => {
    await truncatePost();
    await truncateProfile();
    await truncateUser();
  });

  it('should not store user incomplete informations (name)', async () => {
    const { status, body } = await supertest(app)
      .post('/api/user/store')
      .send({
        email,
        password
      });

    const { row } = body;

    expect(status).toBe(400);
    expect(row).toBe('User has incomplete information');
  });

  it('should not store user incomplete informations (email)', async () => {
    const { status, body } = await supertest(app)
      .post('/api/user/store')
      .send({
        name,
        password
      });

    const { row } = body;

    expect(status).toBe(400);
    expect(row).toBe('User has incomplete information');
  });

  it('should not store user incomplete informations (password)', async () => {
    const { status, body } = await supertest(app)
      .post('/api/user/store')
      .send({
        name,
        email
      });

    const { row } = body;

    expect(status).toBe(400);
    expect(row).toBe('User has incomplete information');
  });

  it('should store user', async () => {
    const { status, body } = await supertest(app)
      .post('/api/user/store')
      .send({
        name,
        email,
        password
      });

    const { row } = body;

    expect(status).toBe(200);
    expect(row.name).toBe(name);
    expect(row.email).toBe(email);
  });

  it('should not store user already existing', async () => {
    const { status, body } = await supertest(app)
      .post('/api/user/store')
      .send({
        name,
        email,
        password
      });

    const { row } = body;

    expect(status).toBe(406);
    expect(row).toBe('User already exists');
  });

  it('should not login user (incorrect email)', async () => {
    const { status, body } = await supertest(app)
      .post('/api/user/login')
      .send({
        email: 'victor@email.com',
        password
      });

    const { row } = body;

    expect(status).toBe(404);
    expect(row).toBe('User not found');
  });

  it('should not login user (incorrect password)', async () => {
    const { status, body } = await supertest(app)
      .post('/api/user/login')
      .send({
        email,
        password: '1234'
      });

    const { row } = body;

    expect(status).toBe(401);
    expect(row).toBe('incorrect user password');
  });

  it('should login user', async () => {
    const { status, body } = await supertest(app)
      .post('/api/user/login')
      .send({
        email,
        password
      });

    const { row } = body;

    token = row.token;
    id = row.user.id;

    expect(status).toBe(200);
    expect(row).toHaveProperty('token');
  });

  it('should not authorized update user (Token required)', async () => {
    const { status, body } = await supertest(app)
      .put(`/api/user/update/${id}`)
      .send({
        email: 'test@email.com',
        passwordConfirm: password
      });

    const { msg } = body;

    expect(status).toBe(403);
    expect(msg).toBe('Token required');
  });

  it('should not authorized update user (Invalid Token)', async () => {
    const { status, body } = await supertest(app)
      .put(`/api/user/update/${id}`)
      .set('Authorization', `bearer falskd`)
      .send({
        email: 'test@email.com',
        passwordConfirm: password
      });

    const { msg } = body;

    expect(status).toBe(401);
    expect(msg).toBe('Invalid Token');
  });

  it('should update user email', async () => {
    const { status, body } = await supertest(app)
      .put(`/api/user/update/${id}`)
      .set('Authorization', `bearer ${token}`)
      .send({
        email: 'test@email.com',
        passwordConfirm: password
      });

    const { row } = body;

    expect(status).toBe(200);
    expect(row.count).toBe(1);
  });

  it('should update user name', async () => {
    const { status, body } = await supertest(app)
      .put(`/api/user/update/${id}`)
      .set('Authorization', `bearer ${token}`)
      .send({
        name: 'nome sobrenome',
        passwordConfirm: password
      });

    const { row } = body;

    expect(status).toBe(200);
    expect(row.count).toBe(1);
  });

  it('should update user password', async () => {
    const { status, body } = await supertest(app)
      .put(`/api/user/update/${id}`)
      .set('Authorization', `bearer ${token}`)
      .send({
        password: 'senhaNova2022',
        passwordConfirm: password
      });

    const { row } = body;

    expect(status).toBe(200);
    expect(row.count).toBe(1);
  });

  it('should not update user (Invalid password)', async () => {
    const { status, body } = await supertest(app)
      .put(`/api/user/update/${id}`)
      .set('Authorization', `bearer ${token}`)
      .send({
        name: 'nome sobrenome',
        passwordConfirm: '1234'
      });

    const { row } = body;

    expect(status).toBe(401);
    expect(row).toBe('Invalid password');
  });
});