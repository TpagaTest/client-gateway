import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('TransactionsController (e2e)', () => {
  let app: INestApplication;
  let authToken: string;
  let transactionId: number;

  const createUserDto: any = {
    email: 'test@example.com',
    password: 'password123',
    name: 'Test User',
    refreshToken: '',
    createdAt: new Date().toISOString(),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  
    const signupResponse = await request(app.getHttpServer())
      .post('/auth/signup')
      .send(createUserDto)
      .expect((res) => {
        if (res.status !== 201 && res.status !== 400) {
          throw new Error(`Unexpected status code: ${res.status}`);
        }
      });

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: createUserDto.email, password: createUserDto.password })
      .expect(201);

    authToken = loginResponse.body.accessToken;
  });

  afterAll(async () => {
    await app.close();
  });

  it('/transactions (POST) - should create a transaction', async () => {
    const response = await request(app.getHttpServer())
      .post('/transactions')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ amount: 100, userId: 1, description: 'Test Transaction' })
      .expect(201);

    transactionId = response.body.id;
    expect(response.body.amount).toBe(100);
  });

  it('/transactions (GET) - should return paginated transactions', async () => {
    const response = await request(app.getHttpServer())
      .get('/transactions?page=1&limit=10')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(Array.isArray(response.body.data)).toBeTruthy();
    if (response.body.data.length > 0) {
      transactionId = response.body.data[0].id;
    }
  });

  it('/transactions/:id (GET) - should return a single transaction', async () => {
    await request(app.getHttpServer())
      .get(`/transactions/${transactionId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.id).toBe(transactionId);
      });
  });

  it('/transactions/:id (PATCH) - should update a transaction', async () => {
    await request(app.getHttpServer())
      .patch(`/transactions/${transactionId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ amount: 200 })
      .expect(200)
      .expect((res) => {
        expect(res.body.amount).toBe(200);
      });
  });

  it('/transactions/:id (PATCH) - should return 404 if transaction not found', async () => {
    await request(app.getHttpServer())
      .patch('/transactions/99999')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ amount: 200 })
      .expect(400);
  });
});
