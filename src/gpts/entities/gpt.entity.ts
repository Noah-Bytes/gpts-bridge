import type {
  gizmo as GizmoModel,
  author as AuthorModel,
  gizmo_metrics as GizmoMetricsModel,
} from '@prisma/client';

export class Gpt {
  gizmos: GizmoModel;
  author: AuthorModel;
  metrics?: GizmoMetricsModel;
}