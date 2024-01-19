import { paginator, PaginatorTypes } from '@nodeteam/nestjs-prisma-pagination';
import { IsNotEmpty } from 'class-validator';

export const paginate: PaginatorTypes.PaginateFunction = paginator({
  page: 1,
  perPage: 10,
});

export class IPage {
  @IsNotEmpty()
  pageNo: number;

  @IsNotEmpty()
  pageSize: number;
}
