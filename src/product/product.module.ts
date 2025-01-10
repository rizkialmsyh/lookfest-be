import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { CloudinaryService } from 'src/libs/cloudinary/cloudinary.service';
import { PrismaService } from 'src/libs/prisma/prisma.service';
import { ProductRepository } from './product.repository';

@Module({
  controllers: [ProductController],
  providers: [
    ProductService,
    CloudinaryService,
    PrismaService,
    ProductRepository,
  ],
})
export class ProductModule {}
