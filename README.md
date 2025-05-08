# GPTS-bridge

GPTs Collector And Report And Link

## 项目简介

这是一个用于收集、报告和链接 GPTs 信息的项目。提供了 GPTs 信息的收集、分类、排名等功能。

## 技术栈

- NestJS
- Prisma (ORM)
- MySQL
- Bull (任务队列)
- Winston (日志)
- TypeScript

## 功能特性

### 已完成
1. GPT Info - GPT 基本信息收集
2. GPT Authors - GPT 作者信息管理
3. Rank - 多维度排名系统
   - 按作者排名
   - 按分类排名
   - 按语言排名
   - 按对话排名

### 待开发
1. 数据去重功能
   - 分类去重
   - 用户去重
   - 搜索去重

## 安装和运行

1. 安装依赖
```bash
npm install
```

2. 环境配置
- 复制 `.env.example` 到 `.env.development`（开发环境）
- 复制 `.env.example` 到 `.env.production`（生产环境）
- 配置相应的环境变量

3. 数据库迁移
```bash
# 开发环境
npm run migrate:dev

# 生产环境
npm run deploy:dev
```

4. 启动服务
```bash
# 开发环境
npm run start:dev

# 生产环境
npm run start:prod
```

## 部署

### GitHub Actions
目前使用 npm 作为包管理器（由于 GitHub Actions 不支持 pnpm）

### Vercel
注意：Vercel 不支持 MySQL，需要更换为其他数据库解决方案

## 问题记录

1. GitHub Actions 不支持 pnpm
```bash
pnpm Dependencies lock file is not found in /home/runner/work/gpts-bridge/gpts-bridge. Supported file patterns: package-lock.json,npm-shrinkwrap.json,yarn.lock
```

2. Vercel 不支持 MySQL 库，需要更换数据库解决方案

## 贡献指南

欢迎提交 Issue 和 Pull Request

## 许可证

UNLICENSED
