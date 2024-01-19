import { Gpt } from '../dto/gpt.dto';

export class DiscoveryEntity {
  info: Info;
  list: List;
}

export class Info {
  id: string;
  title: string;
  description: string;
  display_type: string;
  display_group: string;
  locale: string;
}

export class List {
  items: { resource: Gpt }[];
  cursor: string;
}

export class GizmoByUserId {
  items: Gpt[];
  cursor: string;
}