import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/libs/prisma/prisma.service';
import { MailerService } from 'src/libs/mail/mailer.service';
import { OTPService } from 'src/libs/mail/otp.service';
import { UserRepository } from '../user/user.repository';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/libs/guards/jwt.strategy';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: process.env.JWT_EXPIRATION || '1d',
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserRepository,
    PrismaService,
    MailerService,
    OTPService,
    JwtStrategy,
  ],
})
export class AuthModule {}
