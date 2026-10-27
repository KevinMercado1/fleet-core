import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module.js';

describe('FleetCore API (e2e - General System)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/vehicles (GET) - Should load vehicles module', async () => {
    const response = await request(app.getHttpServer())
      .get('/vehicles')
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
  });

  it('/mechanics (GET) - Should load mechanics module', async () => {
    const response = await request(app.getHttpServer())
      .get('/mechanics')
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
  });

  it('/workshops (GET) - Should load workshops module', async () => {
    const response = await request(app.getHttpServer())
      .get('/workshops')
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
  });

  it('/users (GET) - Should check users endpoint protection or availability', async () => {
    const response = await request(app.getHttpServer()).get('/users');

    expect([200, 401, 403]).toContain(response.status);
  });

  afterAll(async () => {
    await app.close();
  });
});
