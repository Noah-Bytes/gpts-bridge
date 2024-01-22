export class CreateAuthorDto {
  user_id: string;
  display_name: string;
  link_to: string | null;
  selected_display: string | null;
  is_verified: boolean | null;
  will_receive_support_emails: boolean | null;
  gpt_total: number | null;
}
