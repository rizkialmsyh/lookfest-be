import { Injectable, BadRequestException } from '@nestjs/common';
import { CloudinaryService } from 'src/libs/cloudinary/cloudinary.service';
import { ProductImageRepository } from './product-image.repository';
import { DeleteMultipleProductImagesDto } from './dto/delete-product-image.dto';

@Injectable()
export class ProductImageService {
  constructor(
    private readonly productImageRepository: ProductImageRepository,
    private readonly cloudinary: CloudinaryService,
  ) {}

  async uploadImages(productId: string, files: Express.Multer.File[]) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files uploaded');
    }

    const product =
      await this.productImageRepository.findProductById(productId);

    if (!product) {
      throw new BadRequestException('Product not found');
    }

    const uploadResults = await Promise.all(
      files.map((file) => this.cloudinary.uploadFile(file)),
    );

    const images = uploadResults.map((upload) => ({
      productId,
      imageUrl: upload.secure_url,
      publicId: upload.public_id,
    }));

    await this.productImageRepository.createImages(images);

    return { message: 'Images uploaded successfully' };
  }

  async deleteMultipleImages(dto: DeleteMultipleProductImagesDto) {
    const { productId, productImageIds } = dto;

    const images = await this.productImageRepository.findImagesByIds(
      productId,
      productImageIds,
    );

    if (images.length !== productImageIds.length) {
      throw new BadRequestException(
        'One or more images do not belong to the specified product',
      );
    }

    const deletePromises = images.map((image) =>
      this.cloudinary.deleteFile(image.publicId),
    );
    await Promise.all(deletePromises);

    await this.productImageRepository.deleteImagesByIds(productImageIds);

    return { message: 'Images deleted successfully' };
  }
}
