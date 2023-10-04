import { CreateFileTypeDto, UpdateFileTypeDto } from '../dto';
import { FileTypeEntity } from '../entities';

export interface IFileTypeRepository {
  create(createFileTypeDto: CreateFileTypeDto): Promise<FileTypeEntity>;
  findAll(): Promise<FileTypeEntity[]>;
  findById(id: number): Promise<FileTypeEntity>;
  findByType(type: string): Promise<FileTypeEntity>;
  update(
    id: number,
    updateFileTypeDto: UpdateFileTypeDto,
  ): Promise<void>;
  delete(id: number): Promise<void>;
}
