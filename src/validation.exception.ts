import { UnprocessableEntityException } from "@nestjs/common";
import { ValidationError } from "class-validator";

export class ValidationException extends UnprocessableEntityException {
    constructor(public errors: ValidationError[]) {
        super();
    }
}