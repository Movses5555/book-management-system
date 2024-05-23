import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user';

const secret = process.env.JWT_SECRET as string;

interface UserWithoutPassword extends Omit<User, 'password'> {
  password?: string;
}

export const register = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    let user = await User.create({ username, password: hashedPassword });
    const userWithoutPassword: UserWithoutPassword = user.toJSON() as UserWithoutPassword;
    delete userWithoutPassword.password;
    res.status(201).json(userWithoutPassword);
  } catch (error:any) {
    res.status(500).json({ message: error?.message });
  }
};

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }
    const token = jwt.sign({ id: user.id, username: user.username }, secret, { expiresIn: '1h' });
    res.status(200).json({ token });
  } catch (error:any) {
    res.status(500).json({ message: error.message });
  }
};
