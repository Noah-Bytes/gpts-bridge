import { Module } from '@nestjs/common';
import { LanguageService } from './language.service';
import { LanguageController } from './language.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [LanguageController],
  providers: [PrismaService, LanguageService],
  exports: [LanguageService],
})
export class LanguageModule {}
