import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/libs/prisma/prisma.service";
import { Wishlist } from '@prisma/client';

@Injectable()
export class WishlistRepository {
   constructor(private readonly prisma: PrismaService) {}

   async createWishlist(data: { userId: string, productId: string }): Promise<Wishlist> {
      const checkWishlist = await this.prisma.wishlist.findFirst({
         where: {
            userId: data.userId,
            productId: data.productId
         }
      })

      if (!checkWishlist) {
         return await this.prisma.wishlist.create({
            data
         })
      }
   }

   async getAllWishlist(userId: string): Promise<Wishlist[]> {
      const wishlist = await this.prisma.wishlist.findMany({
         where: { userId },
         include: {
           product: {
            include: {
               images: true,
            }
           }
         },
      });

      wishlist.forEach((item: any) => {
         item.product.wishlist = true;
       });
     
      return wishlist;
   }

   async getWishlistById(id: string, userId: string): Promise<Wishlist> | null {
      return await this.prisma.wishlist.findFirst({
         where: {
            AND: [
               { id: id },
               { userId: userId },
            ],
         },   
      });
   }

   async deleteWishlist(id: string): Promise<Wishlist> | null {
      return await this.prisma.wishlist.delete({
         where: { id },
      });
   }
}