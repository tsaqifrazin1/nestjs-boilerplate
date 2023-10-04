import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { FileTypeEntity } from '../entities';
import { CreateFileTypeDto } from '../dto';
import { ModuleRef } from '@nestjs/core';
import { TransactionFor } from 'nest-transact';
import { FileTypeRepository } from '../repository';

@Injectable()
export class FileTypeService{
  constructor(
    private readonly fileTypeRepository: FileTypeRepository,
    dataSource: DataSource,
  ) {
  }

  async createFileType(
    createFileType: CreateFileTypeDto,
  ): Promise<FileTypeEntity> {
    return this.fileTypeRepository.create(createFileType);
  }

  async getFileType(): Promise<FileTypeEntity[]> {
    return this.fileTypeRepository.findAll();
  }

  async getFileTypeById(id: number): Promise<FileTypeEntity> {
    return this.fileTypeRepository.findById(id);
  }

  async getFileTypeByType(type: string): Promise<FileTypeEntity> {
    return this.fileTypeRepository.findByType(type);
  }

  async updateFileType(
    id: number,
    updateFileType: CreateFileTypeDto,
  ): Promise<void> {
    await this.fileTypeRepository.update(id, updateFileType);
  }

  async deleteFileType(id: number): Promise<void> {
    await this.fileTypeRepository.delete(id);
  }
}
