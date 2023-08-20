import { IsString, IsUrl } from "class-validator";

export class CreateRedirectDto {

    @IsString()
    @IsUrl(null, { message: 'The url must be a valid URL'})
    full_url: string;
}