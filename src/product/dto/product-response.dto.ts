import { ApiProperty } from '@nestjs/swagger';

export class Category {
  @ApiProperty({ example: '3fa1fd75-4ebe-43e6-aacd-46dc815e6c61' })
  id: string;

  @ApiProperty({ example: 'Electronics' })
  name: string;

  @ApiProperty({ example: 'admin' })
  createdBy: string;

  @ApiProperty({ example: '2024-12-31T07:43:27.655Z' })
  createdAt: string;

  @ApiProperty({ example: '2024-12-31T07:47:10.595Z' })
  updatedAt: string;

  @ApiProperty({ required: false, example: null })
  deletedAt: string | null;

  @ApiProperty({ required: false, example: null })
  deletedBy: string | null;
}

export class ProductImage {
  @ApiProperty({ example: '83425f99-9c9b-43b4-9259-b42d082dc10b' })
  id: string;

  @ApiProperty({ example: '2a877f84-8a8a-47aa-930f-9c421e559136' })
  productId: string;

  @ApiProperty({ example: 'https://example.com/image.jpg' })
  imageUrl: string;

  @ApiProperty({ example: '2024-12-31T14:17:47.922Z' })
  createdAt: string;
}

export class ProductResponse {
  @ApiProperty({ example: '2a877f84-8a8a-47aa-930f-9c421e559136' })
  id: string;

  @ApiProperty({ example: '3fa1fd75-4ebe-43e6-aacd-46dc815e6c61' })
  categoryId: string;

  @ApiProperty({ example: 'Updated Smartphone' })
  name: string;

  @ApiProperty({ example: 'A high-end smartphone with amazing features.' })
  description: string;

  @ApiProperty({ example: '799' })
  price: string;

  @ApiProperty({ example: 100 })
  stock: number;

  @ApiProperty({ example: '2024-12-31T14:17:47.922Z' })
  createdAt: string;

  @ApiProperty({ example: '2024-12-31T14:17:47.922Z' })
  updatedAt: string;

  @ApiProperty({ required: false, example: null })
  deletedAt: string | null;

  @ApiProperty({ required: false, example: null })
  deletedBy: string | null;

  @ApiProperty({ example: 'admin' })
  createdBy: string;

  @ApiProperty({
    type: Category,
    example: {
      id: '3fa1fd75-4ebe-43e6-aacd-46dc815e6c61',
      name: 'Electronics',
    },
  })
  category: Category;

  @ApiProperty({
    type: [ProductImage],
    example: [
      {
        id: '83425f99-9c9b-43b4-9259-b42d082dc10b',
        productId: '2a877f84-8a8a-47aa-930f-9c421e559136',
        imageUrl: 'https://example.com/image.jpg',
        createdAt: '2024-12-31T14:17:47.922Z',
      },
    ],
  })
  images: ProductImage[];
}

export class PaginationResponse {
  @ApiProperty({ example: '1' })
  currentPage: string;

  @ApiProperty({ example: 5 })
  totalPages: number;

  @ApiProperty({ example: 50 })
  totalCount: number;

  @ApiProperty({ example: '10' })
  limit: string;
}

export class GetAllProductsResponse {
  @ApiProperty({
    description: 'A message indicating the success of the operation',
    example: 'success get all products',
  })
  message: string;

  @ApiProperty({
    type: [ProductResponse],
    example: [
      {
        id: '2a877f84-8a8a-47aa-930f-9c421e559136',
        categoryId: '3fa1fd75-4ebe-43e6-aacd-46dc815e6c61',
        name: 'Updated Smartphone',
        description: 'A high-end smartphone with amazing features.',
        price: '799',
        stock: 100,
        createdAt: '2024-12-31T14:17:47.922Z',
        updatedAt: '2024-12-31T14:17:47.922Z',
        deletedAt: null,
        deletedBy: null,
        createdBy: 'admin',
        category: {
          id: '3fa1fd75-4ebe-43e6-aacd-46dc815e6c61',
          name: 'Electronics',
        },
        images: [
          {
            id: '83425f99-9c9b-43b4-9259-b42d082dc10b',
            productId: '2a877f84-8a8a-47aa-930f-9c421e559136',
            imageUrl: 'https://example.com/image.jpg',
            createdAt: '2024-12-31T14:17:47.922Z',
          },
        ],
      },
    ],
  })
  data: ProductResponse[];

  @ApiProperty({
    type: PaginationResponse,
    example: { currentPage: '1', totalPages: 5, totalCount: 50, limit: '10' },
  })
  pagination: PaginationResponse;
}
