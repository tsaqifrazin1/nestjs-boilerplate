import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileTypeService } from '../service';
import { TransformResponseInterceptor } from 'src/interceptors';
import { RolesTypeGuard } from 'src/guards';
import { JwtAuthGuard } from 'src/modules/auth/guard';
import { CreateFileTypeDto } from '../dto';
import { RolesTypeDecorators } from 'src/decorators/roles-type.decorator';
import { RoleType } from 'src/common/type';
import { Response } from 'src/common/response';
import { FileTypeMessageConstants } from '../constants';
import { FileTypeCreateDoc, FileTypeDeleteDoc, FileTypeFindAllDoc, FileTypeFindByIdDoc, FileTypeUpdateDoc } from '../docs';
import { IdSerialization } from 'src/common/serialization';
import { FileTypeSerialization } from '../serializations/file_type.serialization';

@Controller('file_type')
@ApiTags('file_type')
export class FileTypeController {
  constructor(private readonly fileTypeService: FileTypeService) {}

  @Post()
  @Response({ serialization: IdSerialization })
  @FileTypeCreateDoc<IdSerialization>(IdSerialization)
  @UseGuards(JwtAuthGuard, RolesTypeGuard)
  @RolesTypeDecorators(RoleType.PLN_SUPERADMIN)
  @ApiOperation({
    summary: 'SUPERADMIN only',
    description: 'create file type',
  })
  @ApiBearerAuth()
  async createFileType(@Body() createFileType: CreateFileTypeDto) {
    const fileType = await this.fileTypeService.createFileType(createFileType);
    return {
      message: FileTypeMessageConstants.SUCCESS_CREATE_FILE_TYPE,
      data: {
        id: fileType.id,
      }
    };
  }

  @Get()
  @Response({ serialization: FileTypeSerialization })
  @FileTypeFindAllDoc<FileTypeSerialization>(FileTypeSerialization)
  @ApiOperation({
    summary: 'No Auth',
    description: 'get all file type',
  })
  async getFileType() {
    const result = await this.fileTypeService.getFileType();
    return {
      message: FileTypeMessageConstants.SUCCESS_GET_FILE_TYPE,
      data: result,
    };
  }

  @Get(':id')
  @Response({ serialization: FileTypeSerialization })
  @FileTypeFindByIdDoc<FileTypeSerialization>(FileTypeSerialization)
  @ApiOperation({
    summary: 'No Auth',
    description: 'get file type by id',
  })
  async getFileTypeById(@Param('id') id: number) {
    const result = await this.fileTypeService.getFileTypeById(id);
    return {
      message: FileTypeMessageConstants.SUCCESS_GET_FILE_TYPE,
      data: result,
    };
  }

  @Patch(':id')
  @Response()
  @FileTypeUpdateDoc()
  @UseGuards(JwtAuthGuard, RolesTypeGuard)
  @RolesTypeDecorators(RoleType.PLN_SUPERADMIN)
  @ApiOperation({
    summary: 'SUPERADMIN only',
    description: 'update file type by id',
  })
  @ApiBearerAuth()
  async updateFileType(
    @Param('id') id: number,
    @Body() updateFileType: CreateFileTypeDto,
  ) {
    const fileType = await this.getFileTypeById(id);
    if (!fileType) {
      throw new NotFoundException(FileTypeMessageConstants.NOT_FOUND_FILE_TYPE);
    }
    await this.fileTypeService.updateFileType(id, updateFileType);
    return {
      message: FileTypeMessageConstants.SUCCESS_UPDATE_FILE_TYPE,
    };
  }

  @Delete(':id')
  @Response()
  @FileTypeDeleteDoc()
  @UseGuards(JwtAuthGuard, RolesTypeGuard)
  @RolesTypeDecorators(RoleType.PLN_SUPERADMIN)
  @ApiOperation({
    summary: 'SUPERADMIN only',
    description: 'delete file type by id',
  })
  @ApiBearerAuth()
  async deleteFileType(@Param('id') id: number) {
    const fileType = await this.getFileTypeById(id);
    if (!fileType) {
      throw new NotFoundException(FileTypeMessageConstants.NOT_FOUND_FILE_TYPE);
    }
    return {
      message: FileTypeMessageConstants.SUCCESS_DELETE_FILE_TYPE,
    };
  }
}
