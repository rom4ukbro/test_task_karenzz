import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { useContainer } from 'class-validator';
import { AppModule } from './../src/app.module';
import { MongooseModule } from '@nestjs/mongoose';

describe('TransactionsController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRootAsync({
          useFactory: () => ({
            uri: 'mongodb://127.0.0.1:27017/test',
            name: 'test',
          }),
        }),
        AppModule,
      ],
    }).compile();
    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    useContainer(app.select(AppModule), { fallbackOnErrors: true });
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should create test users', async () => {
    await request(app.getHttpServer()).get('/users/testUsers');
  });

  describe('Testing get balance', () => {
    it('should throw error not found user', async () => {
      const res = await request(app.getHttpServer())
        .get('/transactions/balance?user=5')
        .expect(400);
      const { message } = res.body;
      expect(message[0]).toEqual('User not found');
    });

    it('should return 0 balance', async () => {
      const res = await request(app.getHttpServer())
        .get('/transactions/balance?user=1')
        .expect(200);

      const { balance, currency } = res.body;
      expect(balance).toEqual(0);
      expect(currency).toEqual('USD');
    });
  });

  describe('Testing create replenishment', () => {
    it('should throw error empty user', async () => {
      const res = await request(app.getHttpServer())
        .post('/transactions/replenishment')
        .send({
          amount: 100,
          bill: 'g7w4md3457n',
        })
        .expect(400);
      const { message } = res.body;
      expect(message[0]).toEqual('User is required');
    });

    it('should throw error not found user', async () => {
      const res = await request(app.getHttpServer())
        .post('/transactions/replenishment')
        .send({
          user: 5,
          amount: 100,
          bill: 'g7w4md3457n',
        })
        .expect(400);
      const { message } = res.body;
      expect(message[0]).toEqual('User not found');
    });

    it('should throw error empty amount', async () => {
      const res = await request(app.getHttpServer())
        .post('/transactions/replenishment')
        .send({
          user: 1,
          bill: 'g7w4md3457n',
        })
        .expect(400);
      const { message } = res.body;
      expect(message[0]).toEqual('Amount is required');
    });

    it('should throw error when amount less 0', async () => {
      const res = await request(app.getHttpServer())
        .post('/transactions/replenishment')
        .send({
          user: 1,
          amount: -1,
          bill: 'g7w4md3457n',
        })
        .expect(400);
      const { message } = res.body;
      expect(message[0]).toEqual('Amount must be greater than 0');
    });

    it('should throw error empty bill', async () => {
      const res = await request(app.getHttpServer())
        .post('/transactions/replenishment')
        .send({
          user: 1,
          amount: 100,
        })
        .expect(400);
      const { message } = res.body;
      expect(message[0]).toEqual('Bill is required');
    });

    it('should create replenishment transaction', async () => {
      const res = await request(app.getHttpServer())
        .post('/transactions/replenishment')
        .send({
          user: 1,
          amount: 100,
          bill: 'g7w4md3457n',
        })
        .expect(201);

      const { user, amount, bill, type } = res.body;
      expect(user).toEqual(1);
      expect(amount).toEqual(100);
      expect(bill).toEqual('g7w4md3457n');
      expect(type).toEqual('bill');
    });

    it('should return 100 balance', async () => {
      const res = await request(app.getHttpServer())
        .get('/transactions/balance?user=1')
        .expect(200);
      const { balance, currency } = res.body;
      expect(balance).toEqual(100);
      expect(currency).toEqual('USD');
    });
  });

  describe('Testing create buying', () => {
    it('should throw error empty user', async () => {
      const res = await request(app.getHttpServer())
        .post('/transactions/buying')
        .send({
          amount: -50,
          product: 'k14n3lm63g3d',
        })
        .expect(400);
      const { message } = res.body;
      expect(message[0]).toEqual('User is required');
    });

    it('should throw error not found user', async () => {
      const res = await request(app.getHttpServer())
        .post('/transactions/buying')
        .send({
          user: 5,
          amount: -50,
          product: 'k14n3lm63g3d',
        })
        .expect(400);
      const { message } = res.body;
      expect(message[0]).toEqual('User not found');
    });

    it('should throw error empty product', async () => {
      const res = await request(app.getHttpServer())
        .post('/transactions/buying')
        .send({
          user: 1,
          amount: -50,
        })
        .expect(400);
      const { message } = res.body;
      expect(message[0]).toEqual('Product is required');
    });

    it('should throw error empty amount', async () => {
      const res = await request(app.getHttpServer())
        .post('/transactions/buying')
        .send({
          user: 1,
          product: 'k14n3lm63g3d',
        })
        .expect(400);
      const { message } = res.body;
      expect(message[0]).toEqual('Amount is required');
    });

    it('should throw error when amount greater 0', async () => {
      const res = await request(app.getHttpServer())
        .post('/transactions/buying')
        .send({
          user: 1,
          amount: 10,
          product: 'k14n3lm63g3d',
        })
        .expect(400);
      const { message } = res.body;
      expect(message[0]).toEqual('Amount must be less than 0');
    });

    it('should create buying transaction', async () => {
      const res = await request(app.getHttpServer())
        .post('/transactions/buying')
        .send({
          user: 1,
          amount: -50,
          product: 'k14n3lm63g3d',
        })
        .expect(201);

      const { user, amount, product, type } = res.body;
      expect(user).toEqual(1);
      expect(amount).toEqual(-50);
      expect(product).toEqual('k14n3lm63g3d');
      expect(type).toEqual('buying');
    });

    it('should return 50 balance', async () => {
      const res = await request(app.getHttpServer())
        .get('/transactions/balance?user=1')
        .expect(200);
      const { balance, currency } = res.body;
      expect(balance).toEqual(50);
      expect(currency).toEqual('USD');
    });
  });

  describe('Testing create p2p', () => {
    it('should throw error empty user', async () => {
      const res = await request(app.getHttpServer())
        .post('/transactions/p2p')
        .send({
          amount: -25,
          userTo: 2,
        })
        .expect(400);
      const { message } = res.body;
      expect(message[0]).toEqual('User is required');
    });

    it('should throw error not found user', async () => {
      const res = await request(app.getHttpServer())
        .post('/transactions/p2p')
        .send({
          user: 5,
          amount: -25,
          userTo: 2,
        })
        .expect(400);
      const { message } = res.body;
      expect(message[0]).toEqual('User not found');
    });

    it('should throw error empty userTo', async () => {
      const res = await request(app.getHttpServer())
        .post('/transactions/p2p')
        .send({
          user: 1,
          amount: -25,
        })
        .expect(400);
      const { message } = res.body;
      expect(message[0]).toEqual(
        'User to whom the transaction is assigned is required',
      );
    });

    it('should throw error not found userTo', async () => {
      const res = await request(app.getHttpServer())
        .post('/transactions/p2p')
        .send({
          user: 1,
          amount: -25,
          userTo: 5,
        })
        .expect(400);
      const { message } = res.body;
      expect(message[0]).toEqual('No transaction recipient found');
    });

    it('should throw error empty amount', async () => {
      const res = await request(app.getHttpServer())
        .post('/transactions/p2p')
        .send({
          user: 1,
          userTo: 2,
        })
        .expect(400);
      const { message } = res.body;
      expect(message[0]).toEqual('Amount is required');
    });

    it('should throw error when amount greater 0', async () => {
      const res = await request(app.getHttpServer())
        .post('/transactions/p2p')
        .send({
          user: 1,
          amount: 25,
          userTo: 2,
        })
        .expect(400);
      const { message } = res.body;
      expect(message[0]).toEqual('Amount must be less than 0');
    });

    it('should create p2p transaction', async () => {
      const res = await request(app.getHttpServer())
        .post('/transactions/p2p')
        .send({
          user: 1,
          amount: -25,
          userTo: 2,
        })
        .expect(201);

      const { user, amount, userTo, type } = res.body;
      expect(user).toEqual(1);
      expect(amount).toEqual(-25);
      expect(userTo).toEqual(2);
      expect(type).toEqual('p2p');
    });

    it('should return 25 balance in user1', async () => {
      const res = await request(app.getHttpServer())
        .get('/transactions/balance?user=1')
        .expect(200);
      const { balance, currency } = res.body;
      expect(balance).toEqual(25);
      expect(currency).toEqual('USD');
    });

    it('should return 25 balance in user2', async () => {
      const res = await request(app.getHttpServer())
        .get('/transactions/balance?user=2')
        .expect(200);
      const { balance, currency } = res.body;
      expect(balance).toEqual(25);
      expect(currency).toEqual('USD');
    });
  });
});
