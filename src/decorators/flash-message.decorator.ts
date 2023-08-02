import { ExecutionContext, createParamDecorator } from "@nestjs/common"

export const FlashMessage = createParamDecorator((data: unknown, context: ExecutionContext) => {
    const httpRequest = context.switchToHttp().getRequest();
    const session = httpRequest.session;

    if (!session.flash) {
        return null;
    }

    const message = session.flash;
    session.flash = null;

    return message;
});