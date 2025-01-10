import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/libs/prisma/prisma.service';
import { Category } from '@prisma/client';


@Injectable()
export class CategoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createCategory(data: {
    name: string;
    createdBy: string;
  }): Promise<Category> {
    return this.prisma.category.create({
      data: {
        name: data.name,
        createdBy: data.createdBy,
      },
    });
  }

  async updateCategory(id: string, data: { name?: string }): Promise<Category> {
    return this.prisma.category.update({
      where: { id },
      data,
    });
  }

  async softDeleteCategory(id: string, deletedBy: string): Promise<Category> {
    return this.prisma.category.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        deletedBy,
      },
    });
  }

  async softDeleteProductsByCategory(categoryId: string, deletedBy: string) {
    await this.prisma.product.updateMany({
      where: { categoryId },
      data: {
        deletedAt: new Date(),
        deletedBy,
      },
    });
  }

  async getActiveCategories(
    page: number,
    limit: number,
  ): Promise<{
    categories: Category[];
    totalCount: number;
  }> {
    const skip = page && limit ? (page - 1) * limit : undefined;
    const take = Number(limit) || undefined;
      
    const totalCount = await this.prisma.category.count({
      where: { deletedAt: null },
    });
  
    const categories = await this.prisma.category.findMany({
      where: { deletedAt: null },
      skip,
      take,
      orderBy: { createdAt: 'desc' },
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
      },
    });
  
    return { categories, totalCount };
  }

  async getSoftDeletedCategories(
    page: number, 
    limit: number
  ): Promise<{
    categories: Category[];
    totalCount: number;
  }> {
    const skip = page && limit ? (page - 1) * limit : undefined;
    const take = Number(limit) || undefined;

    const totalCount = await this.prisma.category.count({
      where: { deletedAt: { not: null } },
    });

    const categories = await this.prisma.category.findMany({
      where: { deletedAt: { not: null } },
      skip,
      take,
      orderBy: { createdAt: 'desc' },
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
      },
    });

    return { categories, totalCount };
  }

  async findCategoryById(id: string): Promise<Category | null> {
    return this.prisma.category.findUnique({
      where: { id, deletedAt: null },
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
      },
    });
  }

  async recoverCategory(id: string): Promise<Category | null> {
    return this.prisma.category.update({
      where: { id },
      data: {
        deletedAt: null,
        deletedBy: null,
      },
    });
  }
}
