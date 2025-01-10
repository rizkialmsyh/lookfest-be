import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/libs/prisma/prisma.service';

@Injectable()
export class ProductImageRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findProductById(productId: string) {
    return this.prisma.product.findUnique({ where: { id: productId } });
  }

  async findImagesByIds(productId: string, imageIds: string[]) {
    return this.prisma.productImage.findMany({
      where: {
        id: { in: imageIds },
        productId,
      },
    });
  }

  async createImages(
    images: { productId: string; imageUrl: string; publicId: string }[],
  ) {
    return this.prisma.productImage.createMany({ data: images });
  }

  async deleteImagesByIds(imageIds: string[]) {
    return this.prisma.productImage.deleteMany({
      where: { id: { in: imageIds } },
    });
  }
}
