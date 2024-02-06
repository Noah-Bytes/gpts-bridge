import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoryModule } from '../category/category.module';
import { ConfigModule } from '@nestjs/config';
import { GizmosModule } from '../gizmos/gizmos.module';
import { AuthorModule } from '../author/author.module';
import { GizmoMetricsModule } from '../gizmo-metrics/gizmo-metrics.module';
import { BullModule } from '@nestjs/bull';
import { ChatOpenaiModule } from '../chat-openai/chat-openai.module';
import { ScheduleModule } from '@nestjs/schedule';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import 'winston-daily-rotate-file';
import { GizmoSearchModule } from '../gizmo-search/gizmo-search.module';
import { GptsModule } from '../gpts/gpts.module';
import { LanguageModule } from '../language/language.module';
import { BullProcessorModule } from '../bull-processor/bull-processor.module';
import { ReportModule } from '../report/report.module';
import { ArticleModule } from '../article/article.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      // NODE_ENV 最后多一个空格
      envFilePath: `.env.${process.env.NODE_ENV.trim()}`,
      isGlobal: true,
      cache: true,
    }),
    BullModule.forRootAsync({
      useFactory: () => ({
        redis: {
          host: process.env.REDIS_HOST,
          port: +process.env.REDIS_PORT,
          username: process.env.REDIS_USERNAME,
          password: process.env.REDIS_PASSWORD,
        },
      }),
    }),
    ScheduleModule.forRoot(),
    WinstonModule.forRoot({
      level: 'info',
      // 记录时添加时间戳信息
      format: winston.format.combine(
        winston.format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss',
        }),
        winston.format.splat(),
        winston.format.printf(({ timestamp, level, message }) => {
          return `${timestamp} [${level}]: ${message}`;
        }),
      ),
      transports: [
        new winston.transports.DailyRotateFile({
          dirname: process.env.LOG_PATH,
          level: 'error',
          filename: '%DATE%.error', // 日志名称，占位符 %DATE% 取值为 datePattern 值。
          datePattern: 'YYYY-MM-DD', // 日志轮换的频率，此处表示每天。
          zippedArchive: true, // 是否通过压缩的方式归档被轮换的日志文件。
          maxSize: '20m', // 设置日志文件的最大大小，m 表示 mb 。
          maxFiles: '14d', // 保留日志文件的最大天数，此处表示自动删除超过 14 天的日志文件。
        }),
        new winston.transports.DailyRotateFile({
          dirname: process.env.LOG_PATH,
          filename: '%DATE%.log', // 日志名称，占位符 %DATE% 取值为 datePattern 值。
          datePattern: 'YYYY-MM-DD', // 日志轮换的频率，此处表示每天。
          zippedArchive: true, // 是否通过压缩的方式归档被轮换的日志文件。
          maxSize: '20m', // 设置日志文件的最大大小，m 表示 mb 。
          maxFiles: '14d', // 保留日志文件的最大天数，此处表示自动删除超过 14 天的日志文件。
        }),
      ],
    }),
    AuthorModule,
    CategoryModule,
    GizmosModule,
    GizmoMetricsModule,
    ChatOpenaiModule,
    GizmoSearchModule,
    GptsModule,
    LanguageModule,
    BullProcessorModule,
    ReportModule,
    ArticleModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
