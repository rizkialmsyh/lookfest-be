import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Request,
  UseGuards,
  Query,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { ApiTags, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { CreateCategoryDto } from './dto/create.category.dto';
import { UpdateCategoryDto } from './dto/update.category.dto';
import { JwtAuthGuard } from 'src/libs/guards/jwt-auth.guard';
import {
  CategoryListResponseDto,
  CategoryResponseDto,
} from './dto/category.response.dto';
import { RolesGuard } from 'src/libs/guards/roles.guard';
import { Roles } from 'src/libs/guards/roles.decorator';

@ApiTags('Categories')
@Controller('v1/categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: 'The category has been successfully created.',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  async createCategory(
    @Body() createCategoryDto: CreateCategoryDto,
    @Request() req,
  ) {
    const userId = req.user.sub;
    return this.categoryService.createCategory(createCategoryDto, userId);
  }

  @Patch(':id')
  @ApiResponse({
    status: 200,
    description: 'The category has been successfully updated.',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  async updateCategory(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.updateCategory(id, updateCategoryDto);
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'The category has been successfully soft-deleted.',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles('admin')
  async softDeleteCategory(@Param('id') id: string, @Request() req) {
    const userId = req.user.sub;
    return this.categoryService.softDeleteCategory(id, userId);
  }

  @Get('all-active')
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number for pagination',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of items per page',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved active categories',
    type: CategoryListResponseDto,
  })
  async getActiveCategories(
    @Query('page') page: number,
    @Query('limit') limit: number,
  ): Promise<CategoryListResponseDto> {
    return this.categoryService.getActiveCategories(page, limit);
  }

  @Get('all-soft-deleted')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number for pagination',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of items per page',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved soft-deleted categories',
    type: CategoryListResponseDto,
  })
  async getSoftDeletedCategories(
    @Query('page') page: number,
    @Query('limit') limit: number,
  ): Promise<CategoryListResponseDto> {
    return this.categoryService.getSoftDeletedCategories(page, limit);
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved category',
    type: CategoryResponseDto,
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getCategoryById(
    @Param('id') id: string,
  ): Promise<{ message: string; category: CategoryResponseDto }> {
    return this.categoryService.getCategoryById(id);
  }

  @Patch(':id/recover')
  @ApiResponse({
    status: 200,
    description: 'The category has been successfully recovered.',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  async recoverCategory(@Param('id') id: string): Promise<{ message: string }> {
    return this.categoryService.recoverCategory(id);
  }
}
