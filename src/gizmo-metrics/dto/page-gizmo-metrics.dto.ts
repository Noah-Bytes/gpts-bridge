import { IPage } from '../../utils/page';
import { IsNotEmpty } from 'class-validator';

export class PageGizmoMetricsDto extends IPage {
  userId?: string;

  @IsNotEmpty()
  gizmoId: string;

  @IsNotEmpty()
  startDate: string;

  @IsNotEmpty()
  endDate: string;
}
