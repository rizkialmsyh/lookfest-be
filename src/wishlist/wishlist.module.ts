import { Module } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { WishlistController } from './wishlist.controller';
import { PrismaService } from 'src/libs/prisma/prisma.service';
import { WishlistRepository } from './wishlist.repository';

@Module({
  controllers: [WishlistController],
  providers: [WishlistService, WishlistRepository, PrismaService],
})
export class WishlistModule {}
