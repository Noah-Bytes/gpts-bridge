import { gizmo as GizmoModule } from '@prisma/client';
import { Transform } from 'class-transformer';
import { idEncrypt } from '../../utils/confuse';

export class Gizmo implements GizmoModule {
  constructor(partial: Partial<Gizmo>) {
    Object.assign(this, partial);
  }

  name: string;
  image: string;
  description: string;
  welcome_message: string;
  prompt_starters: string;
  short_url: string;
  categories: string;
  updated_at: Date;
  tags: string;
  tools: string;
  language: string;
  conversations: bigint;
  uv: bigint;
  pv: bigint;
  like: bigint;
  share: bigint;
  status: number;
  create_time: Date;

  @Transform(({ value }) => idEncrypt(value))
  id: string;

  @Transform(({ value }) => idEncrypt(value))
  user_id: string;
}
