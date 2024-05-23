import { Request, Response, NextFunction } from 'express';
import Author from '../models/author';
import { errorHandler } from '../middleware/errorHandler';

export const createAuthor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const author = await Author.create(req.body);
    res.status(201).json(author);
  } catch (error:any) {
    errorHandler(error, req, res, next);
  }
};

export const getAuthors = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authors = await Author.findAll();
    res.status(200).json(authors);
  } catch (error:any) {
    errorHandler(error, req, res, next);
  }
};

export const updateAuthor = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const updateData = req.body;
  try {
    const author = await Author.findByPk(id);
    if (!author) {
      return res.status(404).json({ message: 'Author not found' });
    }
    await author.update(updateData);
    res.status(200).json(author);
  } catch (error:any) {
    errorHandler(error, req, res, next);
  }
};

export const deleteAuthor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const deleted = await Author.destroy({ where: { id } });
    if (deleted) {
      res.status(204).json({message:'The deletion was successful.'});
    } else {
      res.status(404).json({message:'Author not found'});
    }
  } catch (error:any) {
    errorHandler(error, req, res, next);
  }
};
