import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { MailService } from 'src/mail/mail.service';
import { ConfigModule } from '@nestjs/config';

/**
 * Represents the UsersModule class.
 * This module is responsible for managing users.
 * It imports the PrismaModule and provides the UsersService.
 * It also exports the UsersService for other modules to use.
 */
@Module({
  imports: [
    ConfigModule.forRoot(),
    PrismaModule
  ],
  providers: [UsersService, MailService],
  controllers: [UsersController],
  exports: [UsersService, MailService],
})
export class UsersModule { }
