import { IsString, IsUrl } from "class-validator";

export class CheckHitDTO {

    @IsString()
    @IsUrl({require_tld: false})
    url: string;
}