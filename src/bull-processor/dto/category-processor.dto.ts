import { IsNotEmpty } from 'class-validator';

export class CategoryProcessorDto {
  @IsNotEmpty()
  id: string;
}
