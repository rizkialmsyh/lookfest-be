import { Module } from '@nestjs/common';
import { ReplyService } from './reply.service';
import { ReplyController } from './reply.controller';
import { ReplyRepository } from './reply.repository';
import { PrismaService } from 'src/libs/prisma/prisma.service';

@Module({
  controllers: [ReplyController],
  providers: [ReplyService, ReplyRepository, PrismaService],
})
export class ReplyModule {}
