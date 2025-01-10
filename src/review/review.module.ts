import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { ReviewRepository } from './review.repository';
import { PrismaService } from 'src/libs/prisma/prisma.service';

@Module({
  controllers: [ReviewController],
  providers: [ReviewService, ReviewRepository, PrismaService],
})
export class ReviewModule {}
