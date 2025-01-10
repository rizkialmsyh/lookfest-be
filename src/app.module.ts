import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';
import { ProductImageModule } from './product-image/product-image.module';
import { TransactionModule } from './transaction/transaction.module';
import { ReviewModule } from './review/review.module';
import { ReplyModule } from './reply/reply.module';
import { WishlistModule } from './wishlist/wishlist.module';

@Module({
  imports: [AuthModule, UserModule, CategoryModule, ProductModule, ProductImageModule, TransactionModule, ReviewModule, ReplyModule, WishlistModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
