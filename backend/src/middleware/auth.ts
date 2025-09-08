import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthRequest } from '../routes/memoRoute';

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) 
        {
            console.error('No token found');
            return res.sendStatus(401);
        }
        
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

export const isAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) 
        {
            console.error('No token found');
            return res.sendStatus(401);
        }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        if (req.user?.role !== 'admin') {
            return res.sendStatus(403);
        }
        next();
    });
};
