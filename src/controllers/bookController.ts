import { Request, Response, NextFunction } from 'express';
import Book from '../models/book';
import Author from '../models/author';
import { errorHandler } from '../middleware/errorHandler';

export const createBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { authorId } = req.body;
    const author = await Author.findByPk(authorId);
    if (!author) {
      return res.status(404).json({ message: 'Author not found' });
    }
    const book = await Book.create(req.body);
    res.status(201).json(book);
  } catch (error:any) {
    errorHandler(error, req, res, next);
  }
};

export const getBooks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const books = await Book.findAll();
    res.status(200).json(books);
  } catch (error:any) {
    errorHandler(error, req, res, next);
  }
};

export const updateBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const [updated] = await Book.update(req.body, { where: { id } });
    if (updated) {
      const updatedBook = await Book.findOne({ where: { id } });
      res.status(200).json(updatedBook);
    } else {
      res.status(404).json({message:'Book not found'});
    }
  } catch (error:any) {
    errorHandler(error, req, res, next);
  }
};

export const deleteBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const deleted = await Book.destroy({ where: { id } });
    if (deleted) {
      res.status(204).json({message:'The deletion was successful.'});
    } else {
      res.status(404).json({message:'Book not found'});
    }
  } catch (error:any) {
    errorHandler(error, req, res, next);
  }
};
