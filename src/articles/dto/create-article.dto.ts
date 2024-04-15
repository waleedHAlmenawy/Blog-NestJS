import { ArrayMinSize, IsArray, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class CreateArticleDto {
    @IsNotEmpty()
    @IsString()
    @MinLength(20)
    @MaxLength(85)
    title: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(50)
    @MaxLength(6000)
    body: string;
}
