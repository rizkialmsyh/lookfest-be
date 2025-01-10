import { Injectable, NotFoundException } from '@nestjs/common';
import { CategoryRepository } from './category.repository';
import { CreateCategoryDto } from './dto/create.category.dto';
import { UpdateCategoryDto } from './dto/update.category.dto';
import {
  CategoryListResponseDto,
  CategoryResponseDto,
  PaginationResponse,
} from './dto/category.response.dto';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async createCategory(createCategoryDto: CreateCategoryDto, userId: string) {
    await this.categoryRepository.createCategory({
      name: createCategoryDto.name,
      createdBy: userId,
    });

    return { message: 'Category created successfully' };
  }

  async updateCategory(id: string, updateCategoryDto: UpdateCategoryDto) {
    await this.categoryRepository.updateCategory(id, updateCategoryDto);

    return { message: 'Category updated successfully' };
  }

  async softDeleteCategory(id: string, deletedBy: string) {
    await this.categoryRepository.softDeleteCategory(id, deletedBy);

    await this.categoryRepository.softDeleteProductsByCategory(id, deletedBy);

    return {
      message: 'Category and associated products soft-deleted successfully',
    };
  }

  async getActiveCategories(
    page: number,
    limit: number,
  ): Promise<CategoryListResponseDto> {
    const { categories, totalCount } =
      await this.categoryRepository.getActiveCategories(page, limit);

    const totalPages = limit ? Math.ceil(totalCount / limit) : 1;

    const pagination: PaginationResponse = {
      page,
      totalPages,
      totalCount,
      limit,
    };

    return {
      message: 'success get all active categories',
      categories: categories.map((category) =>
        this.toCategoryResponseDto(category),
      ),
      pagination,
    };
  }

  async getSoftDeletedCategories(
    page: number,
    limit: number,
  ): Promise<CategoryListResponseDto> {
    const { categories, totalCount } =
      await this.categoryRepository.getSoftDeletedCategories( page, limit );

    const totalPages = limit ? Math.ceil(totalCount / limit) : 1;

    const pagination: PaginationResponse = {
      page,
      totalPages,
      totalCount,
      limit,
    };

    return {
      message: 'success get all deleted categories',
      categories: categories,
      pagination,
    };
  }

  private toCategoryResponseDto(category): CategoryResponseDto {
    return {
      id: category.id,
      name: category.name,
      createdByUser: category.createdByUser,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
      deletedAt: category.deletedAt,
      deletedByUser: category.deletedByUser,
    };
  }

  async getCategoryById(
    id: string,
  ): Promise<{ message: string; category: CategoryResponseDto }> {
    const category = await this.categoryRepository.findCategoryById(id);
    if (!category) {
      throw new Error('Category not found');
    }
    return { message: 'success get category', category };
  }

  async recoverCategory(id: string): Promise<{ message: string }> {
    const recoveredCategory = await this.categoryRepository.recoverCategory(id);

    if (!recoveredCategory) {
      throw new NotFoundException('Category not found or not deleted.');
    }

    return { message: 'Category successfully recovered' };
  }
}
