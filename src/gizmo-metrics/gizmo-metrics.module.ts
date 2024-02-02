import { Module } from '@nestjs/common';
import { GizmoMetricsService } from './gizmo-metrics.service';
import { GizmoMetricsController } from './gizmo-metrics.controller';
import { PrismaService } from '../prisma.service';
import { ChatOpenaiModule } from '../chat-openai/chat-openai.module';
import { GizmosModule } from '../gizmos/gizmos.module';
import { GizmoMetricsJob } from './gizmo-metrics.job';

@Module({
  imports: [ChatOpenaiModule, GizmosModule],
  controllers: [GizmoMetricsController],
  providers: [PrismaService, GizmoMetricsService, GizmoMetricsJob],
  exports: [GizmoMetricsService],
})
export class GizmoMetricsModule {}
