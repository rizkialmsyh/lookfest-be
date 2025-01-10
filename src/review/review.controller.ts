import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  UseGuards, 
  Req, 
  Query
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.input.dto';
import { UpdateReviewDto } from './dto/update-review.input.dto';
import { ApiBearerAuth, ApiBody, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/libs/guards/jwt-auth.guard';
import { ReviewListResponseDto, ReviewResponse } from './dto/review-response.dto';
import { RolesGuard } from 'src/libs/guards/roles.guard';
import { Roles } from 'src/libs/guards/roles.decorator';

@Controller('v1/reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get('products/:productId')
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number for pagination',
    schema: { default: 1 },
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of items per page',
    schema: { default: 10 },
  })
  @ApiResponse({
    status: 200,
    description: 'Return all reviews on a product',
    type: [ReviewListResponseDto],
  })
  async findAllByProductId(
    @Param('productId') productId: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    return await this.reviewService.findAllByProductId(page, limit, productId);
  }

  @Get('all')
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number for pagination',
    default: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of items per page',
    default: 10,
  })
  @ApiQuery({
    name: 'isReply',
    required: false,
    type: Boolean,
    description: 'If the review has been replied',
    default: false,
  })
  @ApiResponse({
    status: 200,
    description: 'Return all reviews on a product',
    type: [ReviewListResponseDto],
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async findAll(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('isReply') isReply: string,
  ) {
    return await this.reviewService.findAll(page, limit, isReply);
  }

  @Post()
  @ApiResponse({
    status: 201,
    description: 'The review has been successfully created.',
  })
  @ApiBody({
    type: CreateReviewDto,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async createReview(
    @Body() createReviewDto: CreateReviewDto,
    @Req() req: any,
  ) {
    const { productId, rating, review } = createReviewDto;
    const userId = req.user.sub;
    return await this.reviewService.create( userId, productId, rating, review ); 
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Return a review',
    type: ReviewResponse,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string) {
    return await this.reviewService.findOne(id);    
  }

  @Patch(':id')
  @ApiResponse({
    status: 200,
    description: 'The review has been successfully updated.',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string, 
    @Body() updateReviewDto: UpdateReviewDto,
    @Req() req
  ) {
    const userId = req.user.sub;
    return await this.reviewService.update(id, userId, updateReviewDto);
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'The review has been successfully deleted.',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async remove(
    @Param('id') id: string,
    @Req() req
  ) {
    const userId = req.user.sub;
    return await this.reviewService.remove(id, userId);
  }
}
