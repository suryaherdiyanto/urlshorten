import { Injectable,NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

@Injectable()
export class VerifyCsrf implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        const body = req.body;

        if (!body._csrf) {
            return res.status(400).send('The csrf token are not provided');
        }
        next();
    }
}