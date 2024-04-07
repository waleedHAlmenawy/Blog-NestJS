import { IsIn, IsNotEmpty, IsNumber, IsString, Matches, MinLength } from "class-validator";
import { emailRegex } from "src/regex/email.regex";

export class RegisterDto {
    @IsNotEmpty()
    @IsString()
    @MinLength(2)
    firstName: string;
    
    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    lastName: string;
    
    @IsString()
    @IsNotEmpty()
    @IsIn(['male','female'])
    gender: string;
    
    @IsString()
    @IsNotEmpty()
    @Matches(emailRegex)
    email: string;
    
    @IsString()
    @IsNotEmpty()
    password: string;
}
