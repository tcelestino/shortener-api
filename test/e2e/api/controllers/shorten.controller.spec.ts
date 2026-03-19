import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../../../src/app.module';

describe('ShortenController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /shorten', () => {
    it('should create a short url and return 201', () => {
      return request(app.getHttpServer())
        .post('/shorten')
        .send({ url: 'https://example.com' })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body).toHaveProperty('shortCode');
          expect(res.body.url).toBe('https://example.com');
          expect(res.body).not.toHaveProperty('accessCount');
        });
    });

    it('should return 400 when url is missing', () => {
      return request(app.getHttpServer()).post('/shorten').send({}).expect(400);
    });

    it('should return 400 when url is empty', () => {
      return request(app.getHttpServer())
        .post('/shorten')
        .send({ url: '' })
        .expect(400);
    });
  });

  describe('GET /shorten/:shortCode', () => {
    let shortCode: string;

    beforeAll(async () => {
      const res = await request(app.getHttpServer())
        .post('/shorten')
        .send({ url: 'https://example.com/get' });
      shortCode = res.body.shortCode;
    });

    it('should return the short url by shortCode', () => {
      return request(app.getHttpServer())
        .get(`/shorten/${shortCode}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.shortCode).toBe(shortCode);
          expect(res.body.url).toBe('https://example.com/get');
          expect(res.body).not.toHaveProperty('accessCount');
        });
    });

    it('should return 404 when shortCode is not found', () => {
      return request(app.getHttpServer())
        .get('/shorten/nonexistent-code')
        .expect(404);
    });
  });

  describe('GET /shorten/:shortCode/stats', () => {
    let shortCode: string;

    beforeAll(async () => {
      const res = await request(app.getHttpServer())
        .post('/shorten')
        .send({ url: 'https://example.com/stats' });
      shortCode = res.body.shortCode;
    });

    it('should return stats with accessCount', () => {
      return request(app.getHttpServer())
        .get(`/shorten/${shortCode}/stats`)
        .expect(200)
        .expect((res) => {
          expect(res.body.shortCode).toBe(shortCode);
          expect(res.body).toHaveProperty('accessCount');
          expect(typeof res.body.accessCount).toBe('number');
        });
    });

    it('should increment accessCount after accessing the short url', async () => {
      await request(app.getHttpServer()).get(`/shorten/${shortCode}`);
      await request(app.getHttpServer()).get(`/shorten/${shortCode}`);

      const res = await request(app.getHttpServer())
        .get(`/shorten/${shortCode}/stats`)
        .expect(200);

      expect(res.body.accessCount).toBeGreaterThan(0);
    });

    it('should return 404 when shortCode is not found', () => {
      return request(app.getHttpServer())
        .get('/shorten/nonexistent-code/stats')
        .expect(404);
    });
  });

  describe('PUT /shorten/:shortCode', () => {
    let shortCode: string;

    beforeAll(async () => {
      const res = await request(app.getHttpServer())
        .post('/shorten')
        .send({ url: 'https://example.com/update' });
      shortCode = res.body.shortCode;
    });

    it('should update the url and return 200', () => {
      return request(app.getHttpServer())
        .put(`/shorten/${shortCode}`)
        .send({ url: 'https://example.com/updated' })
        .expect(200)
        .expect((res) => {
          expect(res.body.url).toBe('https://example.com/updated');
          expect(res.body.shortCode).toBe(shortCode);
          expect(res.body).not.toHaveProperty('accessCount');
        });
    });

    it('should return 400 when url is missing', () => {
      return request(app.getHttpServer())
        .put(`/shorten/${shortCode}`)
        .send({})
        .expect(400);
    });

    it('should return 400 when url is empty', () => {
      return request(app.getHttpServer())
        .put(`/shorten/${shortCode}`)
        .send({ url: '' })
        .expect(400);
    });

    it('should return 404 when shortCode is not found', () => {
      return request(app.getHttpServer())
        .put('/shorten/nonexistent-code')
        .send({ url: 'https://example.com' })
        .expect(404);
    });
  });

  describe('DELETE /shorten/:shortCode', () => {
    let shortCode: string;

    beforeAll(async () => {
      const res = await request(app.getHttpServer())
        .post('/shorten')
        .send({ url: 'https://example.com/delete' });
      shortCode = res.body.shortCode;
    });

    it('should delete the short url and return 204', () => {
      return request(app.getHttpServer())
        .delete(`/shorten/${shortCode}`)
        .expect(204);
    });

    it('should return 404 when trying to delete an already deleted shortCode', () => {
      return request(app.getHttpServer())
        .delete(`/shorten/${shortCode}`)
        .expect(404);
    });

    it('should return 404 for nonexistent shortCode', () => {
      return request(app.getHttpServer())
        .delete('/shorten/nonexistent-code')
        .expect(404);
    });
  });
});
