import request from 'supertest';
import bcrypt from 'bcryptjs';
import app from '../src/app'; 
import sequelize from '../src/config/database';
import User from '../src/models/user';

let token: string;
let authorId: number;

beforeAll(async () => {
  await sequelize.sync({ force: true });
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
  const newAuthorResponse = await request(app)
    .post('/api/authors')
    .set('Authorization', `Bearer ${token}`)
    .send({
      name: 'Jane Smith',
      biography: 'Lorem ipsum',
      dateOfBirth: '1980-01-01'
    });
  authorId = newAuthorResponse.body.id;
});

afterAll(async () => {
  await sequelize.close();
});

describe('Books API', () => {

  it('should create a new book', async () => {
    const response = await request(app)
      .post('/api/books')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Sample Book',
        isbn: '1234567890',
        publishedDate: '2022-01-01',
        authorId: authorId
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.title).toBe('Sample Book');
  });

  it('should retrieve all books', async () => {
    const response = await request(app)
      .get('/api/books')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should update a book by ID', async () => {
    const newBookResponse = await request(app)
      .post('/api/books')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Sample Book',
        isbn: '1234567890',
        publishedDate: '2022-01-01',
        authorId: authorId
      });
    const bookId = newBookResponse.body.id;

    const response = await request(app)
      .put(`/api/books/${bookId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Updated Book Title',
        isbn: '0987654321',
        publishedDate: '2023-01-01',
        authorId: authorId
      });

    expect(response.status).toBe(200);
    expect(response.body.title).toBe('Updated Book Title');
  });

  it('should delete a book by ID', async () => {
    const newBookResponse = await request(app)
      .post('/api/books')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Sample Book',
        isbn: '1234567890',
        publishedDate: '2022-01-01',
        authorId: authorId
      });
    const bookId = newBookResponse.body.id;

    const response = await request(app)
      .delete(`/api/books/${bookId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(204);
  });
});
