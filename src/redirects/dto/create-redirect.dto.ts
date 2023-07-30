import { IsString, IsUrl } from "class-validator";

export class CreateRedirectDto {

    @IsString()
    @IsUrl()
    full_url: string;
}