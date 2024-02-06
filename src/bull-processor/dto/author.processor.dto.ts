import { IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';
import { idDecrypt } from '../../utils/confuse';

export class AuthorProcessorDto {
  @Transform(({ value }) => idDecrypt(value))
  @IsNotEmpty()
  userId: string;
}
