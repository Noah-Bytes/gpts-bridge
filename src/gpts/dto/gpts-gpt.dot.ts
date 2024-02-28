import { IPage } from '../../utils/page';
import { Transform } from 'class-transformer';
import { idDecrypt } from '../../utils/confuse';

export class GptsGptDot extends IPage {
  @Transform(({ value }) => idDecrypt(value))
  id?: string;

  @Transform(({ value }) => idDecrypt(value))
  userId?: string;

  category?: string;
  date?: string;
  query?: string;
}

export class GptDot {
  @Transform(({ value }) => idDecrypt(value))
  id: string;
  date?: string;
}
