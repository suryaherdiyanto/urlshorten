import { Injectable, NestMiddleware } from "@nestjs/common";
import { log } from "console";
import { NextFunction, Request, Response } from "express";

declare global {
    namespace Express {
      export interface Request {
        flash(key: string, value: unknown): unknown;

        flash(key: string): unknown | undefined;
      }
    }
  }

  declare module 'express-session' {
    interface SessionData {
      flash: { [key: string]: unknown };
    }
  }

@Injectable()
export class FlashMessageMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        req.flash = (key: string, value?: unknown) => {
            const session = req.session;
            session.flash = session.flash ?? {};

            if (value === undefined) {
                const data = session.flash[key] ?? null;

                delete session.flash[key];
                return data;
            }

            session.flash[key] = value;
        }
        next();
    }
}