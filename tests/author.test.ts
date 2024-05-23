import request from 'supertest';
import bcrypt from 'bcryptjs';
import app from '../src/app'; 
import sequelize from '../src/config/database';
import User from '../src/models/user';

let token: string;

beforeAll(async () => {
  await sequelize.sync({ force: false });
  await User.create({
    username: 'username',
    password: await bcrypt.hash('password', 10),
  });

  const loginResponse = await request(app)
    .post('/api/login')
    .send({
      username: 'username',
      password: 'password',
    });
  token = loginResponse.body.token;
});

afterAll(async () => {
  await sequelize.close();
});

describe('Authors API', () => {
  it('should create a new author', async () => {
    const response = await request(app)
      .post('/api/authors')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'John Doe',
        biography: 'Lorem ipsum',
        dateOfBirth: '1990-01-01'
      });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
  });

  it('should retrieve all authors', async () => {
    const response = await request(app)
      .get('/api/authors')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should update an author by ID', async () => {
    const newAuthorResponse = await request(app)
      .post('/api/authors')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Jane Smith',
        biography: 'Lorem ipsum',
        dateOfBirth: '1980-01-01'
      });
    const authorId = newAuthorResponse.body.id;
    const updateAuthor = {
      name: 'Jane Doe',
      biography: 'Updated biography'
    };
    const updatedAuthor = {
      id: authorId,
      name: 'Jane Doe',
      biography: 'Updated biography',
      dateOfBirth: '1980-01-01T00:00:00.000Z'
    };
    const response = await request(app)
      .put(`/api/authors/${authorId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updateAuthor);
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject(updatedAuthor);
  });

  it('should delete an author by ID', async () => {
    const newAuthorResponse = await request(app)
      .post('/api/authors')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'John Doe',
        biography: 'Lorem ipsum',
        dateOfBirth: '1990-01-01'
      });
    const authorId = newAuthorResponse.body.id;
    const deleteResponse = await request(app)
      .delete(`/api/authors/${authorId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(deleteResponse.status).toBe(204);
  });
});
