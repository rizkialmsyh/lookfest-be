import { Module } from '@nestjs/common';
import { ProductImageService } from './product-image.service';
import { ProductImageController } from './product-image.controller';
import { PrismaService } from 'src/libs/prisma/prisma.service';
import { CloudinaryService } from 'src/libs/cloudinary/cloudinary.service';
import { ProductImageRepository } from './product-image.repository';

@Module({
  controllers: [ProductImageController],
  providers: [
    ProductImageService,
    PrismaService,
    CloudinaryService,
    ProductImageRepository,
  ],
})
export class ProductImageModule {}
