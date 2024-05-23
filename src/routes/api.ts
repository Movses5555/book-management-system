import express from 'express';
import { register, login } from '../controllers/authController';
import { createBook, getBooks, updateBook, deleteBook } from '../controllers/bookController';
import { createAuthor, getAuthors, updateAuthor, deleteAuthor } from '../controllers/authorController';
import { authenticateToken } from '../middleware/auth';
import { validateRequest } from '../middleware/validateRequest';
import {
  registerValidationRules,
  loginValidationRules,
  validate,
  authorUpdateValidation,
  validateAuthor,
  validateBook,
  validateAuthorId,
  validateBookId
} from '../middleware/validators';

const router = express.Router();

// Authentication routes
router.post('/register', registerValidationRules(), validate, register);
router.post('/login', loginValidationRules(), validate, login);

// Author routes
router.post('/authors', authenticateToken, validateAuthor, validateRequest, createAuthor);
router.get('/authors', authenticateToken, getAuthors);
router.put('/authors/:id', authenticateToken, authorUpdateValidation, validate, updateAuthor);
router.delete('/authors/:id', authenticateToken, validateAuthorId, validateRequest, deleteAuthor);

// Book routes
router.post('/books', authenticateToken, validateBook, validateRequest, createBook);
router.get('/books', authenticateToken, getBooks);
router.put('/books/:id', authenticateToken, validateBookId, validateBook, validateRequest, updateBook);
router.delete('/books/:id', authenticateToken, validateBookId, validateRequest, deleteBook);

export default router;
