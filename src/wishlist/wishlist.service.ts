import { Injectable } from '@nestjs/common';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { WishlistRepository } from './wishlist.repository';

@Injectable()
export class WishlistService {
  constructor(private readonly wishlistRepository: WishlistRepository) {}

  async createWishlist(createWishlistDto: CreateWishlistDto, userId: string) {
    await this.wishlistRepository.createWishlist({
      userId,
      productId: createWishlistDto.productId
    })
    return { message: 'Product has successfully added to wishlist'};
  }

  async getWishlistById(id: string, userId: string) {
    const wishlist = await this.wishlistRepository.getWishlistById(id, userId);
    return { message: 'Success get wishlist', data: wishlist };
  }

  async getAllWishlist(userId: string) {
    const wishlists = await this.wishlistRepository.getAllWishlist(userId);

    return { message: 'Success get all wishlist', data: wishlists };
  }

  async deleteWishlist(id: string) {
    await this.wishlistRepository.deleteWishlist(id);
    
    return { message: 'Product deleted successfully'}
  }
}
