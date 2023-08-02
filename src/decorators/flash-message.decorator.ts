import { ExecutionContext, createParamDecorator } from "@nestjs/common"

export const FlashMessage = createParamDecorator((data: string, context: ExecutionContext) => {
    const httpRequest = context.switchToHttp().getRequest();
    const session = httpRequest.session;

    if (!session.flash) {
        return null;
    }

    if (!session.flash[data]) {
        return null;
    }

    const message = session.flash[data];
    session.flash[data] = null;

    return message;
});