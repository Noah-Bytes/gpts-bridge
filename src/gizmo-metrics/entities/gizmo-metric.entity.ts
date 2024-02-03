import { gizmo_metrics as GizmoMetricsModel } from '@prisma/client';
import { Exclude, Transform } from 'class-transformer';
import { Gizmo } from '../../gizmos/entities/gizmo.entity';

export class GizmoMetric implements GizmoMetricsModel {
  @Exclude()
  id: bigint;

  @Exclude()
  user_id: string;

  @Exclude()
  gizmo_id: string;

  num_conversations_str: number;
  pv: number;
  date: string;

  @Transform(({ value }) => new Gizmo(value))
  gizmos?: Gizmo;

  constructor(partial: Partial<GizmoMetric>) {
    console.log(partial);
    Object.assign(this, partial);
  }
}
