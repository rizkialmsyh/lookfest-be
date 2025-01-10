import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductRepository } from './product.repository';
import { CloudinaryService } from 'src/libs/cloudinary/cloudinary.service';
import { CreateProductDto } from './dto/create-product.input.dto';
import { UpdateProductDto } from './dto/update-product.input.dto';
import { ProductResponseDto } from './dto/productId-response.dto';

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async createProduct(dto: CreateProductDto, userId: string) {
    const uploadResponses = await Promise.all(
      dto.images.map((file) => this.cloudinaryService.uploadFile(file)),
    );

    // const imageUrls = uploadResponses.map(
    //   (uploadResponse) => uploadResponse.secure_url,
    // );

    const product = await this.productRepository.createProduct({
      categoryId: dto.categoryId,
      name: dto.name,
      description: dto.description,
      price: dto.price,
      stock: Number(dto.stock),
      createdBy: userId,
    });

    // await Promise.all(
    //   imageUrls.map((url) =>
    //     this.productRepository.saveProductImage(product.id, url),
    //   ),
    // );

    const productImages = uploadResponses.map((uploadResponse) => ({
      productId: product.id,
      imageUrl: uploadResponse.secure_url,
      publicId: uploadResponse.public_id,
    }));

    // Simpan data gambar ke tabel productImage
    await this.productRepository.saveProductImages(productImages);

    return {
      message: 'Product created successfully',
    };
  }

  async updateProduct(
    productId: string,
    dto: UpdateProductDto,
    userId: string,
  ): Promise<{ message: string }> {
    const product = await this.productRepository.findProductById(productId);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    await this.productRepository.updateProduct(productId, {
      ...dto,
      updatedBy: userId,
    });

    return { message: 'Product updated successfully' };
  }

  async softDeleteProduct(productId: string, userId: string) {
    const product = await this.productRepository.findProductById(productId);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    await this.productRepository.updateProduct(productId, {
      deletedAt: new Date(),
      deletedBy: userId,
    });

    return { message: 'Product soft-deleted successfully' };
  }

  async recoverProduct(productId: string) {
    const product = await this.productRepository.findProductById(productId);
    if (!product || !product.deletedAt) {
      throw new NotFoundException('Product not found or not soft-deleted');
    }

    await this.productRepository.recoverProduct(productId, {
      deletedAt: null,
      deletedBy: null,
    });

    return { message: 'Product recovered successfully' };
  }

  async getActiveProducts(
    page: number,
    limit: number,
    name?: string,
    category?: string,
    mostPopular?: boolean,
    userId?: string,
  ) {
    const result = await this.productRepository.getAllProducts(
      true,
      page,
      limit,
      name,
      category,
      mostPopular,
      userId,
    );

    if (result.products.length === 0) {
      return {
        message: 'success get all active products',
        data: [],
        pagination: {
          currentPage: page,
          totalPages: 0,
          totalCount: 0,
          limit: limit,
        },
      };
    }

    return {
      message: 'success get all active products',
      data: result.products,
      pagination: {
        currentPage: page,
        totalPages: result.totalPages,
        totalCount: result.totalCount,
        limit: limit,
      },
    };
  }

  async getDeletedProducts(page: number, limit: number, name?: string) {
    const result = await this.productRepository.getProductsByStatus(
      false,
      page,
      limit,
      name,
    );

    return result;
  }

  async getProductById(
    productId: string,
    userId: string | null,
  ): Promise<ProductResponseDto> {
    const product = await this.productRepository.findById(productId);

    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    const isInWishlist: { id: string } | boolean = userId
      ? await this.productRepository.isProductInWishlist(userId, productId)
      : false;

    return this.mapToProductResponseDto(product, isInWishlist);
  }

  private mapToProductResponseDto(
    product: any,
    isInWishlist: { id: string } | boolean,
  ): ProductResponseDto {
    return {
      id: product.id,
      name: product.name,
      description: product.description,
      price: parseFloat(product.price),
      stock: product.stock,
      category: {
        id: product.category.id,
        name: product.category.name,
      },
      images: product.images.map((image) => image.imageUrl),
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      isInWishlist,
    };
  }
}
