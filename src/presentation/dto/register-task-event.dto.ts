import { IsString, IsNotEmpty, IsOptional, IsObject } from 'class-validator';

export class RegisterTaskEventDto {
  @IsString()
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}