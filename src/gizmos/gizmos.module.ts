import { Module } from '@nestjs/common';
import { GizmosService } from './gizmos.service';
import { GizmosController } from './gizmos.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [GizmosController],
  providers: [PrismaService, GizmosService],
  exports: [GizmosService],
})
export class GizmosModule {}
