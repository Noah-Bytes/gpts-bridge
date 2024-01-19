import { PartialType } from '@nestjs/mapped-types';
import { CreateGizmoMetricDto } from './create-gizmo-metric.dto';

export class UpdateGizmoMetricDto extends PartialType(CreateGizmoMetricDto) {}
