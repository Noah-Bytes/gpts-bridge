import type {
  gizmo as GizmoModel,
  author as AuthorModel,
  gizmo_metrics as GizmoMetricsModel,
} from '@prisma/client';
import { Transform } from 'class-transformer';
import { Gizmo } from '../../gizmos/entities/gizmo.entity';
import { Author } from '../../author/entities/author.entity';
import { GizmoMetric } from '../../gizmo-metrics/entities/gizmo-metric.entity';

export class Gpt {
  constructor(partial: Partial<Gpt>) {
    Object.assign(this, partial);
  }

  @Transform(({ value }) => new Gizmo(value))
  gizmos: GizmoModel;

  @Transform(({ value }) => new Author(value))
  author: AuthorModel;

  @Transform(({ value }) => new GizmoMetric(value))
  metrics?: GizmoMetricsModel;
}
