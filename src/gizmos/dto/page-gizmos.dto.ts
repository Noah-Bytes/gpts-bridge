import { IPage } from '../../utils/page';
import { Transform } from 'class-transformer';
import { idDecrypt } from '../../utils/confuse';

export class PageGizmosDto extends IPage {
  @Transform(({ value }) => idDecrypt(value))
  id?: string;

  @Transform(({ value }) => idDecrypt(value))
  userId?: string;

  category?: string;

  createStarDate?: string;
  createEndDate?: string;
  uptStartDate?: string;
  uptEndDate?: string;
  language?: string;
}
