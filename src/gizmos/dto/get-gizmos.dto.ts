import { Max } from 'class-validator';

export class TopGizmosDto {
  @Max(10, {
    message: 'limit must not be greater than 10',
  })
  limit: number;
}


export class CountGizmoDto {
  user_id?: string;
}