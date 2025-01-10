export class ProductResponseDto {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: {
    id: string;
    name: string;
  };
  images: string[];
  createdAt: Date;
  updatedAt: Date;
  isInWishlist: { id: string } | boolean;
}
