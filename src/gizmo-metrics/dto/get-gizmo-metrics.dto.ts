import { Max } from 'class-validator';

export class TopGizmosMetricsDto {
  @Max(10, {
    message: 'limit must not be greater than 10',
  })
  limit: number;
}
