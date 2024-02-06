import { Max } from 'class-validator';

export class GetTopAuthorDto {
  @Max(10, {
    message: 'limit must not be greater than 10',
  })
  limit: number;
}

export class CountAuthorDto {
  user_id?: string;
  selected_display?: string;
  is_verified?: boolean;
  will_receive_support_emails?: boolean;
}
