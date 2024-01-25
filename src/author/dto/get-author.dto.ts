import { Max } from 'class-validator';

export class GetTopAuthorDto {
  @Max(10, {
    message: 'limit must not be greater than 10',
  })
  limit: number;
}
