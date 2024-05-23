import request from 'supertest';
import bcrypt from 'bcryptjs';
import app from '../src/app';
import sequelize from '../src/config/database';
import User from '../src/models/user';

beforeAll(async () => {
  await sequelize.sync({ force: false });
});

afterAll(async () => {
  await sequelize.close();
});

describe('Auth API', () => {
  it('should register a new user', async () => {
    const response = await request(app)
      .post('/api/register')
      .send({
        username: 'testuser',
        password: 'testpassword',
      });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('username', 'testuser');
  });

  it('should not register a user with an existing username', async () => {
    await User.create({ username: 'existinguser', password: 'password' });

    const response = await request(app)
      .post('/api/register')
      .send({
        username: 'existinguser',
        password: 'password',
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Username already exists');
  });

  it('should login an existing user and return a JWT token', async () => {
    await User.create({
      username: 'loginuser',
      password: await bcrypt.hash('loginpassword', 10),
    });

    const response = await request(app)
      .post('/api/login')
      .send({
        username: 'loginuser',
        password: 'loginpassword',
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });

  it('should not login with incorrect username or password', async () => {
    const response = await request(app)
      .post('/api/login')
      .send({
        username: 'wronguser',
        password: 'wrongpassword',
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Invalid username or password');
  });
});
