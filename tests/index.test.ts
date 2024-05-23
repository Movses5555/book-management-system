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
