import { daily_report as DailyReportModule } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class DailyReport implements DailyReportModule {
  @Exclude()
  id: bigint;

  date: string;

  value: number;

  @Exclude()
  type: number;

  @Exclude()
  subType: string;

  constructor(partial: Partial<DailyReport>) {
    Object.assign(this, partial);
  }
}
