import { IsString, IsNotEmpty, IsEmail, IsOptional } from 'class-validator';

export class GoogleLoginDto {
  @IsString()
  @IsNotEmpty()
  googleToken: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  googleId: string;

  @IsString()
  @IsOptional()
  picture?: string;
}

