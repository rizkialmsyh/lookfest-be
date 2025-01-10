import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/libs/guards/roles.decorator';
import { JwtAuthGuard } from 'src/libs/guards/jwt-auth.guard';
import { RolesGuard } from 'src/libs/guards/roles.guard';

@ApiTags('Wishlist')
@ApiBearerAuth()
@Controller('v1/wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: 'The wishlist has been successfully created.',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  create(
    @Body() createWishlistDto: CreateWishlistDto,
    @Request() req,
  ) {
    const userId = req.user.sub;
    return this.wishlistService.createWishlist(createWishlistDto, userId);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved all wishlist',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  getAllWishlist(@Request() req) {
    const userId = req.user.sub;

    return this.wishlistService.getAllWishlist(userId);
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved wishlist by id',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  getWishlistById(
    @Param('id') id: string,
    @Request() req,
  ) {
    const userId = req.user.sub;
    return this.wishlistService.getWishlistById(id, userId);
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'The wishlist has been successfully deleted.',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  deleteWishlist(@Param('id') id: string) {
    return this.wishlistService.deleteWishlist(id);
  }
}
