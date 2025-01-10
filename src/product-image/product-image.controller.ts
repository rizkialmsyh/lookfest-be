import {
  Controller,
  Post,
  Delete,
  Body,
  UploadedFiles,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiConsumes, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { ProductImageService } from './product-image.service';
import { CreateProductImageDto } from './dto/create-product-image.dto';
import { DeleteMultipleProductImagesDto } from './dto/delete-product-image.dto';
import { Roles } from 'src/libs/guards/roles.decorator';
import { JwtAuthGuard } from 'src/libs/guards/jwt-auth.guard';
import { RolesGuard } from 'src/libs/guards/roles.guard';

@ApiTags('Product Images')
@Controller('v1/product-images')
@ApiBearerAuth()
export class ProductImageController {
  constructor(private readonly productImageService: ProductImageService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        productId: { type: 'string', format: 'uuid' },
        files: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
        },
      },
    },
  })
  @UseInterceptors(FilesInterceptor('files'))
  async uploadImages(
    @Body() dto: CreateProductImageDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.productImageService.uploadImages(dto.productId, files);
  }

  @Delete()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async deleteMultipleImages(@Body() dto: DeleteMultipleProductImagesDto) {
    return this.productImageService.deleteMultipleImages(dto);
  }
}
