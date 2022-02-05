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

describe('User', () => {
  beforeAll(async () => {
    await truncatePost();
    await truncateProfile();
    await truncateUser();
  });

  it('should findAll users', async () => {
    const { status } = await supertest(app)
      .get('/api/user/list');

    expect(status).toBe(200);
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
});