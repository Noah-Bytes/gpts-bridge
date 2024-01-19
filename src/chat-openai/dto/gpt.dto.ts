export class Gpt {
  gizmo: Gizmo;
  tools: Tool[];
  files: File[];
  product_features: ProductFeatures;
}

export class Gizmo {
  id: string;
  organization_id: string;
  short_url: string;
  author: Author;
  voice: Voice;
  workspace_id: any;
  model: any;
  instructions: any;
  settings: any;
  display: Display;
  share_recipient: string;
  updated_at: string;
  last_interacted_at: any;
  tags: string[];
  version: any;
  live_version: any;
  training_disabled: any;
  allowed_sharing_recipients: any;
  review_info: any;
  appeal_info: any;
  vanity_metrics: VanityMetrics;
  workspace_approved: any;
}

export class Author {
  user_id: string;
  display_name: string;
  link_to?: string;
  selected_display: string;
  is_verified: boolean;
  will_receive_support_emails?: boolean;
}

export class Voice {
  id: string;
}

export class Display {
  name: string;
  description: string;
  welcome_message: string;
  prompt_starters: string[];
  profile_picture_url: string;
  categories: string[];
}

export class VanityMetrics {
  num_conversations_str: string;
  num_pins: number;
  num_users_interacted_with: number;
}

export class Tool {
  id: string;
  type: string;
  settings: any;
  metadata: any;
}

export class File {
  id: string;
  type: string;
  file_id: string;
  location: string;
}

export class ProductFeatures {
  attachments: Attachments;
}

export class Attachments {
  type: string;
  accepted_mime_types: string[];
  image_mime_types: string[];
  can_accept_all_mime_types: boolean;
}
