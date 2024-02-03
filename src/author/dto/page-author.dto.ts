import { IPage } from '../../utils/page';
import { Transform } from 'class-transformer';
import { idDecrypt } from '../../utils/confuse';

export class PageAuthorDto extends IPage {
  @Transform(({ value }) => idDecrypt(value))
  userId?: string;
}
