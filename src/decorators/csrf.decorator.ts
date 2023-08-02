import { SetMetadata } from '@nestjs/common';
import * as Tokens from 'csrf';

export const CreateCsrfToken = (...args: string[]) => {
    const token = new Tokens();
    const secret = token.secretSync();

    return SetMetadata('csrf', token.create(secret));
};
