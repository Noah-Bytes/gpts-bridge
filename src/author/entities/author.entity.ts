import { author as AuthorModel } from '.prisma/client';
import { Transform } from 'class-transformer';
import { idEncrypt } from '../../utils/confuse';

export class Author implements AuthorModel {
  constructor(partial: Partial<Author>) {
    Object.assign(this, partial);
  }

  @Transform(({ value }) => idEncrypt(value))
  user_id: string;

  create_time: Date;
  display_name: string | null;
  gpt_total: number | null;
  is_verified: boolean | null;
  link_to: string | null;
  selected_display: string | null;
  upt_time: Date;
  will_receive_support_emails: boolean | null;
}
