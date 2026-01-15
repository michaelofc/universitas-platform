import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
    userId?: string;
    userEmail?: string;
    userType?: string;
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                error: 'Unauthorized',
                message: 'Token not provided'
            });
        }

        const token = authHeader.substring(7);
        const secret = process.env.JWT_SECRET!;

        const decoded = jwt.verify(token, secret) as {
            userId: string;
            email: string;
            tipo: string;
        };

        req.userId = decoded.userId;
        req.userEmail = decoded.email;
        req.userType = decoded.tipo;

        next();
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({
                error: 'Unauthorized',
                message: 'Token expired'
            });
        }

        return res.status(401).json({
            error: 'Unauthorized',
            message: 'Invalid token'
        });
    }
};

export const requireRole = (roles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.userType || !roles.includes(req.userType)) {
            return res.status(403).json({
                error: 'Forbidden',
                message: 'Insufficient permissions'
            });
        }
        next();
    };
};
