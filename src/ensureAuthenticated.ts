import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

import authConfig from './authConfig';

interface ITokenPayload {
    iat: number;
    exp: number;
    sub: string;
}

export default function ensureAuthenticated(request: Request, response: Response, next: NextFunction) {
    const authHeader = request.headers.authorization;

    if(!authHeader) {
        // throw new AppError('Faltando token', 401);
        return response.json({msg: "falta token"});
    }

    const [, token] = authHeader.split(' ');

    try {
        const decoded = verify(token, authConfig.jwt.secret);

        const { sub } = decoded as ITokenPayload;

        response.locals.jwtPayload = sub;

        return next();
    } catch(err) {
        // throw new AppError('Token invalido', 401);
        return response.json({msg: "Token invalido"});
    }
    


}