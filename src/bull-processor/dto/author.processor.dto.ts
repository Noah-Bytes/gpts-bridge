import { IsNotEmpty } from 'class-validator';

export class AuthorProcessorDto {
  @IsNotEmpty()
  userId: string;
}
