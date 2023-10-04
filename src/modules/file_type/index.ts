import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileTypeController } from './controller';
import { FileTypeEntity } from './entities';
import { FileTypeService } from './service';
import { FileTypeRepository } from './repository';

@Module({
  imports: [TypeOrmModule.forFeature([FileTypeEntity])],
  controllers: [FileTypeController],
  providers: [FileTypeService, FileTypeRepository],
  exports: [FileTypeService, FileTypeRepository],
})
export class FileTypeModule {}
