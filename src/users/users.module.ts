import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

/**
 * Represents the UsersModule class.
 * This module is responsible for managing users.
 * It imports the PrismaModule and provides the UsersService.
 * It also exports the UsersService for other modules to use.
 */
@Module({
  imports: [PrismaModule],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule { }
