import { PartialType } from '@nestjs/mapped-types';
import { CreateGizmoDto } from './create-gizmo.dto';

export class UpdateGizmoDto extends PartialType(CreateGizmoDto) {}
