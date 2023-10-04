import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationsService } from './service/organizations.service';
import { OrganizationEntity } from './entities';
import { Module } from '@nestjs/common';
import { OrganizationsController } from './controller';

@Module({
  imports: [TypeOrmModule.forFeature([OrganizationEntity])],
  controllers: [OrganizationsController],
  providers: [OrganizationsService],
  exports: [OrganizationsService],
})
export class OrganizationsModule {}
