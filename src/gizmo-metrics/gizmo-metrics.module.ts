import { Module } from '@nestjs/common';
import { GizmoMetricsService } from './gizmo-metrics.service';
import { GizmoMetricsController } from './gizmo-metrics.controller';
import { PrismaService } from '../prisma.service';
import { ChatOpenaiModule } from '../chat-openai/chat-openai.module';

@Module({
  imports: [ChatOpenaiModule],
  controllers: [GizmoMetricsController],
  providers: [PrismaService, GizmoMetricsService],
  exports: [GizmoMetricsService],
})
export class GizmoMetricsModule {}
