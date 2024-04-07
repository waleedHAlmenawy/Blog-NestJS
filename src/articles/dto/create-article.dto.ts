import { ArrayMinSize, IsArray, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class CreateArticleDto {
    @IsNotEmpty()
    @IsString()
    @MinLength(10)
    @MaxLength(350)
    title: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(100)
    @MaxLength(1000)
    body: string;

    @IsArray()
    @IsString({each: true})
    @ArrayMinSize(1)
    @IsNotEmpty()
    images: string;
}
