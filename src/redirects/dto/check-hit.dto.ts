import { IsString, IsUrl } from "class-validator";

export class CheckHitDTO {

    @IsString()
    @IsUrl()
    url: string;
}