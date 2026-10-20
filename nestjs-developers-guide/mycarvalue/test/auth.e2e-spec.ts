import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module.js';
import { App } from 'supertest/types.js';

describe('Authentication System (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('handles the signup request /auth/signup (POST)', async () => {
    const mainEmail = `test-${Date.now()}@example.com`;

    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: mainEmail, password: '2' });

    expect(res.status).toBe(201);

    const { email, id } = res.body;

    expect(id).toBeDefined();
    expect(email).toEqual(mainEmail);
  });

  it('signup as new user then get the currently logged in user', async () => {
    const email = 'asdf@ass.com';

    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email, password: '1' })
      .expect(201);

    const cookie = res.get('Set-Cookie');

    if (!cookie) {
      return;
    }

    const { body } = await request(app.getHttpServer())
      .get('/auth/whoami')
      .set('Cookie', cookie)
      .expect(200);

    expect(body.email).toEqual(email + 'kkk');
  });

  afterEach(async () => {
    await app.close();
  });
});
