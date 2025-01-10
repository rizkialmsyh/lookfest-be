import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/libs/prisma/prisma.service';

@Injectable()
export class ProductRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createProduct(data: {
    categoryId: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    createdBy: string;
  }): Promise<any> {
    return this.prisma.product.create({
      data,
    });
  }

  // async saveProductImage(productId: string, imageUrl: string): Promise<any> {
  //   return this.prisma.productImage.create({
  //     data: {
  //       productId,
  //       imageUrl,
  //     },
  //   });
  // }

  async saveProductImages(
    images: { productId: string; imageUrl: string; publicId: string }[],
  ) {
    return this.prisma.productImage.createMany({
      data: images,
    });
  }

  async findProductById(productId: string): Promise<any> {
    return this.prisma.product.findUnique({
      where: { id: productId },
    });
  }

  async updateProduct(productId: string, data: any): Promise<any> {
    const updateData: any = {
      category: data.categoryId
        ? { connect: { id: data.categoryId } }
        : undefined,
      name: data.name,
      description: data.description,
      price: data.price,
      stock: data.stock,
    };

    if (data.deletedAt && data.deletedBy) {
      updateData.deletedAt = data.deletedAt;
      updateData.deletedBy = data.deletedBy;
    }

    return this.prisma.product.update({
      where: {
        id: productId,
      },
      data: updateData,
    });
  }

  async recoverProduct(productId: string, data: any): Promise<any> {
    const updateData: any = {};

    if (data.deletedAt === null) {
      updateData.deletedAt = null;
      updateData.deletedBy = null;
    }

    return this.prisma.product.update({
      where: { id: productId },
      data: updateData,
    });
  }

  async getAllProducts(
    excludeDeleted: boolean,
    page: number = 1,
    limit: number = 10,
    name?: string,
    category?: string,
    mostPopular?: boolean,
    userId?: string,
  ) {
    const skip = (page - 1) * limit;
    const whereCondition = excludeDeleted
      ? { deletedAt: null }
      : { deletedAt: { not: null } };

    if (name) {
      whereCondition['name'] = {
        contains: name,
        mode: 'insensitive',
      };
    }

    if (category) {
      whereCondition['category'] = {
        name: {
          contains: category,
          mode: 'insensitive',
        },
      };
    }

    const products = await this.prisma.product.findMany({
      where: whereCondition,
      skip,
      take: Number(limit),
      include: {
        createdByUser: {
          select: {
            id: true,
            profiles: {
              select: {
                nickname: true,
                fullname: true,
              },
            },
          },
        },
        wishlists: userId
          ? {
              where: {
                userId: userId,
              },
              select: {
                id: true,
                productId: true,
                userId: true,
              },
            }
          : false,
        deletedByUser: {
          select: {
            id: true,
            profiles: {
              select: {
                nickname: true,
                fullname: true,
              },
            },
          },
        },
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        images: true,
        reviews: {
          select: {
            id: true,
            rating: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Hitung total data produk
    const totalCount = await this.prisma.product.count({
      where: whereCondition,
    });

    // Hitung total halaman
    const totalPages = Math.ceil(totalCount / limit);

    // Hitung rata-rata rating untuk setiap produk
    const productsWithAvgRating = products.map((product) => {
      const ratings = product.reviews.map((review) => review.rating);
      const avgRating =
        ratings.length > 0
          ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
          : null;
      return {
        ...product,
        avgRating,
      };
    });

    const productWishWishlist = productsWithAvgRating.map((product) => {
      if (!product.wishlists || product?.wishlists?.length === 0) {
        return { ...product, wishlist: false };
      } else {
        return { ...product, wishlist: true };
      }
    });

    if (mostPopular) {
      productWishWishlist.sort(
        (a, b) => (b.avgRating || 0) - (a.avgRating || 0),
      );
    }

    return {
      products: productWishWishlist,
      totalPages,
      totalCount,
    };
  }

  async getProductsByStatus(
    excludeDeleted: boolean,
    page: number,
    limit: number,
    name?: string,
    category?: string,
  ) {
    const { products, totalPages, totalCount } = await this.getAllProducts(
      excludeDeleted,
      page,
      limit,
      name,
      category,
    );

    return {
      message: 'success get all products',
      data: products,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        limit,
      },
    };
  }

  async findById(productId: string, userId?: string) {
    return this.prisma.product.findUnique({
      where: { id: productId },
      include: {
        category: true,
        images: true,
      },
    });
  }

  async isProductInWishlist(
    userId: string,
    productId: string,
  ): Promise<{ id: string }> {
    const wishlist = await this.prisma.wishlist.findFirst({
      where: {
        userId,
        productId,
      },
      select: {
        id: true,
      },
    });

    return wishlist;
  }
}
