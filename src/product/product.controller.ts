import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFiles,
  UseGuards,
  Req,
  Patch,
  Param,
  Delete,
  Get,
  Query,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ProductService } from './product.service';
import { JwtAuthGuard } from 'src/libs/guards/jwt-auth.guard';
import { CreateProductDto } from './dto/create-product.input.dto';
import {
  ApiConsumes,
  ApiBody,
  ApiBearerAuth,
  ApiQuery,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { UpdateProductDto } from './dto/update-product.input.dto';
import { Roles } from 'src/libs/guards/roles.decorator';
import { RolesGuard } from 'src/libs/guards/roles.guard';
import { GetAllProductsResponse } from './dto/product-response.dto';
import { ProductResponseDto } from './dto/productId-response.dto';

@Controller('v1/products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateProductDto })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @UseInterceptors(FilesInterceptor('images', 10))
  async createProduct(
    @UploadedFiles() images: Express.Multer.File[],
    @Body() dto: Omit<CreateProductDto, 'images'>,
    @Req() req: any,
  ) {
    const userId = req.user.sub;
    return this.productService.createProduct({ ...dto, images }, userId);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiBody({
    type: UpdateProductDto,
    description: 'Update product details',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async updateProduct(
    @Param('id') productId: string,
    @Body() dto: UpdateProductDto,
    @Req() req: any,
  ): Promise<{ message: string }> {
    const userId = req.user.sub;
    return this.productService.updateProduct(productId, dto, userId);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async softDeleteProduct(
    @Param('id') productId: string,
    @Req() req: any,
  ): Promise<{ message: string }> {
    const userId = req.user.sub;
    return this.productService.softDeleteProduct(productId, userId);
  }

  @Patch(':id/recover')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async recoverProduct(
    @Param('id') productId: string,
  ): Promise<{ message: string }> {
    return this.productService.recoverProduct(productId);
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
  @ApiQuery({
    name: 'name',
    required: false,
    type: String,
    description: 'Search products by name',
  })
  @ApiQuery({
    name: 'category',
    required: false,
    type: String,
    description: 'Search products by category',
  })
  @ApiQuery({
    name: 'mostPopular',
    required: false,
    type: Boolean,
    description: 'Sort products by most popular (highest average rating)',
  })
  @ApiResponse({
    status: 200,
    description: 'List of active products',
    type: GetAllProductsResponse,
  })
  @ApiQuery({
    name: 'userid',
    required: false,
    type: String,
    description: 'Userid for include wishlist user',
  })
  async getActiveProducts(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('name') name?: string,
    @Query('category') category?: string,
    @Query('mostPopular') mostPopular?: boolean,
    @Query('userid') userid?: string,
  ) {
    const result = await this.productService.getActiveProducts(
      page,
      limit,
      name,
      category,
      mostPopular,
      userid,
    );
    return result;
  }

  @Get('all-deleted')
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
  @ApiQuery({
    name: 'name',
    required: false,
    type: String,
    description: 'Search products by name',
  })
  @ApiResponse({
    status: 200,
    description: 'List of deleted products',
    type: GetAllProductsResponse,
  })
  async getDeletedProducts(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('name') name?: string,
  ) {
    const result = await this.productService.getDeletedProducts(
      page,
      limit,
      name,
    );
    return result;
  }

  @Get(':id/:userId?')
  @ApiParam({
    name: 'userId',
    required: false,
    description: 'Optional user ID associated with the product',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Product ID to fetch',
  })
  async getProductById(
    @Param('id') id: string,
    @Param('userId') userId?: string,
  ): Promise<ProductResponseDto> {
    const resolvedUserId = userId && userId.trim() !== '' && !userId.includes('{') ? userId : null;
    return this.productService.getProductById(id, resolvedUserId || null);
  }
}
