import { IPage } from '../../utils/page';
import { IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';
import { idDecrypt } from '../../utils/confuse';

export class PageGizmoMetricsDto extends IPage {
  userId?: string;

  @IsNotEmpty()
  @Transform(({ value }) => idDecrypt(value))
  gizmoId: string;

  @IsNotEmpty()
  startDate: string;

  @IsNotEmpty()
  endDate: string;
}
