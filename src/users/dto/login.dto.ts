import { IsNotEmpty, IsString, Matches } from "class-validator";
import { emailRegex } from "src/regex/email.regex";

export class LoginDto {
    @IsString()
    @IsNotEmpty()
    @Matches(emailRegex)
    email: string;
  
    @IsString()
    @IsNotEmpty()
    password: string;
}
