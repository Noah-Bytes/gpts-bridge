import { Injectable } from '@nestjs/common';
import { CreateDailyReportDto } from './dto/create-daily-report.dto';
import { UpdateDailyReportDto } from './dto/update-daily-report.dto';
import { PrismaService } from '../prisma.service';
import { GetDailyReportDto } from './dto/get-daily-report.dto';

@Injectable()
export class DailyReportService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(createDailyReportDto: CreateDailyReportDto) {
    await this.prismaService.daily_report.create({
      data: {
        type: createDailyReportDto.type,
        subType: createDailyReportDto.subType,
        value: createDailyReportDto.value,
        date: createDailyReportDto.date,
      },
    });
  }

  findMany(params: GetDailyReportDto) {
    return this.prismaService.daily_report.findMany({
      where: {
        date: params.date,
        type: params.type,
        subType: params.subType,
      },
    });
  }

  findAll() {
    return `This action returns all dailyReport`;
  }

  findOne(id: number) {
    return `This action returns a #${id} dailyReport`;
  }

  update(id: number, updateDailyReportDto: UpdateDailyReportDto) {
    return `This action updates a #${id} dailyReport`;
  }

  remove(id: number) {
    return `This action removes a #${id} dailyReport`;
  }
}
