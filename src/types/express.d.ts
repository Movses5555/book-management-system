import { Request } from "express"
import { JwtPayload } from 'jsonwebtoken';

declare module 'express-serve-static-core' {
  interface Request {
    user?: string | JwtPayload;
  }
}
declare namespace Express {
  export interface Request {
    user: any
  }
}