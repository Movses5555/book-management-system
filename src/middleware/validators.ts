import { body, validationResult, param  } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const registerValidationRules = () => {
  return [
    body('username').isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
  ];
};

export const loginValidationRules = () => {
  return [
    body('username').not().isEmpty().withMessage('Username is required'),
    body('password').not().isEmpty().withMessage('Password is required')
  ];
};

export const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

export const authorUpdateValidation = [
  body('name').optional().isString().withMessage('Name must be a string'),
  body('biography').optional().isString().withMessage('Biography must be a string'),
  body('dateOfBirth').optional().isDate().withMessage('Date of Birth must be a valid date')
];

export const validateAuthor = [
  body('name').isString().withMessage('Name must be a string'),
  body('biography').optional().isString().withMessage('Biography must be a string'),
  body('dateOfBirth').isDate().withMessage('Date of Birth must be a valid date'),
];

export const validateBook = [
  body('title').isString().withMessage('Title must be a string'),
  body('isbn').isString().withMessage('ISBN must be a string'),
  body('authorId').isInt().withMessage('Author ID must be an integer'),
];

export const validateBookId = [
  param('id').isInt().withMessage('ID must be an integer'),
];

export const validateAuthorId = [
  param('id').isInt().withMessage('ID must be an integer'),
];
