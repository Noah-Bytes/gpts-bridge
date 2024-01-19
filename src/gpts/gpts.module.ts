import { Module } from '@nestjs/common';
import { GptsService } from './gpts.service';
import { GptsController } from './gpts.controller';
import { GizmosModule } from '../gizmos/gizmos.module';
import { GizmoMetricsModule } from '../gizmo-metrics/gizmo-metrics.module';
import { AuthorModule } from '../author/author.module';

@Module({
  imports: [GizmosModule, GizmoMetricsModule, AuthorModule],
  controllers: [GptsController],
  providers: [GptsService],
})
export class GptsModule {}
