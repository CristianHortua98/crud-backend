import { IsEmail, IsNumber, IsString, Matches, MaxLength, MinLength } from "class-validator";


export class CreateUserDto {

    @IsString()
    @MinLength(5)
    nombre: string;

    @IsNumber()
    numero_documento: number;

    @IsString()
    @MinLength(5)
    usuario: string;

    @IsString()
    @MinLength(6)
    @MaxLength(50)
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'The password must have a Uppercase, lowercase letter and a number'
    })
    password: string;

    @IsString()
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    telefono: number;


}
