import { IPage } from '../../utils/page';
import { IsNotEmpty } from 'class-validator';

export class PageDailyReportDto extends IPage {
  @IsNotEmpty()
  startDate: string;

  @IsNotEmpty()
  endDate: string;

  @IsNotEmpty()
  type: number;

  subType?: string;
}
