import { HttpStatus, applyDecorators } from '@nestjs/common';
import { Docs, IAnotherDocs } from 'src/common/docs';
import { ClassConstructor } from 'class-transformer';
import { FileTypeMessageConstants } from '../constants';

export function FileTypeCreateDoc<T>(
  data: ClassConstructor<T>,
  anotherDocs?: IAnotherDocs[],
): MethodDecorator {
  return applyDecorators(
    Docs<T>(
      FileTypeMessageConstants.SUCCESS_CREATE_FILE_TYPE,
      '/file_type',
      HttpStatus.CREATED,
      {
        response: {
          data: data,
        },
        auth: {
          jwtAccessToken: true,
          rolePermissions: true,
        },
        anotherDocs,
      },
    ),
  );
}

export function FileTypeFindAllDoc<T>(
  data: ClassConstructor<T>,
  anotherDocs?: IAnotherDocs[],
): MethodDecorator {
  return applyDecorators(
    Docs<T>(
      FileTypeMessageConstants.SUCCESS_GET_FILE_TYPE,
      '/file_type',
      HttpStatus.OK,
      {
        response: {
          data: data,
          isArray: true,
        },
        anotherDocs,
      },
    ),
  );
}

export function FileTypeFindByIdDoc<T>(
  data: ClassConstructor<T>,
  anotherDocs?: IAnotherDocs[],
): MethodDecorator {
  return applyDecorators(
    Docs<T>(
      FileTypeMessageConstants.SUCCESS_GET_FILE_TYPE,
      '/file_type/:id',
      HttpStatus.OK,
      {
        response: {
          data: data,
        },
        anotherDocs,
      },
    ),
  );
}

export function FileTypeUpdateDoc(
  anotherDocs?: IAnotherDocs[],
): MethodDecorator {
  const docs: IAnotherDocs[] = [
    {
      message: FileTypeMessageConstants.NOT_FOUND_FILE_TYPE,
      description: 'File type not found',
      requestUrl: '/file_type/:id',
    },
  ];
  return applyDecorators(
    Docs<void>(
      FileTypeMessageConstants.SUCCESS_UPDATE_FILE_TYPE,
      '/file_type/:id',
      HttpStatus.OK,
      {
        auth: {
          jwtAccessToken: true,
          rolePermissions: true,
        },
        anotherDocs: [...docs, ...(anotherDocs || [])],
      },
    ),
  );
}

export function FileTypeDeleteDoc(
  anotherDocs?: IAnotherDocs[],
): MethodDecorator {
  const docs: IAnotherDocs[] = [
    {
      message: FileTypeMessageConstants.NOT_FOUND_FILE_TYPE,
      description: 'File type not found',
      requestUrl: '/file_type/:id',
    },
  ];
  return applyDecorators(
    Docs<void>(
      FileTypeMessageConstants.SUCCESS_UPDATE_FILE_TYPE,
      '/file_type/:id',
      HttpStatus.OK,
      {
        auth: {
          jwtAccessToken: true,
          rolePermissions: true,
        },
        anotherDocs: [...docs, ...(anotherDocs || [])],
      },
    ),
  );
}
