import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class CreateCommentDto {
    @IsNotEmpty()
    @IsString()
    @MaxLength(200)
    
    body: string;
}
