import { ArgumentsHost, Catch, ExceptionFilter, HttpException, ValidationError } from "@nestjs/common";
import { Request, Response } from "express";
import { ValidationException } from "./validation.exception";

@Catch(ValidationException)
export class ValidationExceptionFilter implements ExceptionFilter {
    catch(exception: ValidationException, host: ArgumentsHost) {
        const context = host.switchToHttp();
        const response = context.getResponse<Response>();
        const request = context.getRequest<Request>();
        const errors: { [property: string]: string[] } = {};

        exception.errors.forEach((error: ValidationError) => {
            errors[error.property] = Object.values(error.constraints);
        });

        request.flash('errors', errors);

        response.redirect('back');
    }
}