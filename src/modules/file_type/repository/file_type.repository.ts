import { InjectRepository } from '@nestjs/typeorm';
import { IFileTypeRepository } from '../interfaces';
import { Repository } from 'typeorm';
import { FileTypeEntity } from '../entities';
import { CreateFileTypeDto } from '../dto';
import { ModuleRef } from '@nestjs/core';
import { TransactionFor } from 'nest-transact';

export class FileTypeRepository extends TransactionFor<FileTypeRepository> implements IFileTypeRepository {
  constructor(
    @InjectRepository(FileTypeEntity)
    private readonly fileTypeRepository: Repository<FileTypeEntity>,
    moduleRef: ModuleRef,
  ) {
    super(moduleRef);
  }

  async create(createFileTypeDto: CreateFileTypeDto): Promise<FileTypeEntity> {
    const fileTypeRepository = this.fileTypeRepository.create();
    return this.fileTypeRepository.save(fileTypeRepository);
  }

  async findAll(): Promise<FileTypeEntity[]> {
    const queryBuilder =
      this.fileTypeRepository.createQueryBuilder('file_type');

    return queryBuilder.getMany();
  }

  async findById(id: number): Promise<FileTypeEntity> {
    const queryBuilder =
      this.fileTypeRepository.createQueryBuilder('file_type');
    queryBuilder.where('file_type.id = :id', { id });

    return queryBuilder.getOne();
  }

  async findByType(type: string): Promise<FileTypeEntity> {
    const queryBuilder =
      this.fileTypeRepository.createQueryBuilder('file_type');
    queryBuilder.where('file_type.type = :type', { type });

    return queryBuilder.getOne();
  }

  async update(
    id: number,
    updateFileTypeDto: CreateFileTypeDto,
  ): Promise<void> {
    await this.fileTypeRepository.update(id, updateFileTypeDto);
  }

  async delete(id: number): Promise<void> {
    await this.fileTypeRepository.delete(id);
  }
}
