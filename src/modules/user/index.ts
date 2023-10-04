import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entitites';
import { UserController } from './controller';
import { UserService } from './services';
import { OrganizationsModule } from '../organizations';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    OrganizationsModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
