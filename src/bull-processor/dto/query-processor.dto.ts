import { IsNotEmpty } from 'class-validator';

export class QueryProcessorDto {
  @IsNotEmpty()
  queries: string[];
}
