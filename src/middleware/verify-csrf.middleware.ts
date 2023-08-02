import { Injectable,NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import * as Tokens from "csrf";

@Injectable()
export class VerifyCsrf implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        const body = req.body;

        if (!body._csrf) {
            return res.status(400).send('The csrf token are not provided');
        }
        const csrfToken: string = body._csrf;

        const token = new Tokens();
        const [csrf, secret] = csrfToken.split('.');

        if (!token.verify(secret, csrf)) {
            return res.status(400).send('Csrf token are not valid');
        }
        next();
    }
}