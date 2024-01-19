import { IsNotEmpty } from 'class-validator';

export class ListByCategoryDto {
  @IsNotEmpty()
  key: string;

  @IsNotEmpty()
  cursor: number;

  @IsNotEmpty()
  limit: number;
  locale?: string;
}

export class ListByUserIdDto {
  @IsNotEmpty()
  userId: string;
}


export class ListBySearchDto {
  @IsNotEmpty()
  query: string;
}