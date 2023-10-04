import { HttpStatus, applyDecorators } from '@nestjs/common';
import { Docs, IAnotherDocs } from 'src/common/docs';
import { ClassConstructor } from 'class-transformer';
import { USER_STATUS_CODE_ERRORS } from '../constants/users.status-code.constants';
import { USER_MESSAGE_RESPONSE } from '../constants/user.message.constants';

export function UserCreateDoc(anotherDocs?: IAnotherDocs[]): MethodDecorator {
  return applyDecorators(
    Docs<void>(
      USER_MESSAGE_RESPONSE.USER_CREATED_SUCCESSFULLY,
      '/users',
      HttpStatus.CREATED,
      {
        auth: {
          jwtAccessToken: true,
          rolePermissions: true,
        },
        anotherDocs,
      },
    ),
  );
}

export function UserReadAllDoc<T>(
  data: ClassConstructor<T>,
  anotherDocs?: IAnotherDocs[],
): MethodDecorator {
  return applyDecorators(
    Docs<T>(
      USER_MESSAGE_RESPONSE.USER_READ_ALL_SUCCESSFULLY,
      '/users',
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

export function UserReadOneDoc<T>(
  data: ClassConstructor<T>,
  anotherDocs?: IAnotherDocs[],
): MethodDecorator {
  return applyDecorators(
    Docs<T>(
      USER_MESSAGE_RESPONSE.USER_READ_ONE_SUCCESSFULLY,
      '/users/:id',
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

export function UserUpdateDoc(anotherDocs?: IAnotherDocs[]): MethodDecorator {
  return applyDecorators(
    Docs<void>(
      USER_MESSAGE_RESPONSE.USER_UPDATED_SUCCESSFULLY,
      '/users/:id',
      HttpStatus.OK,
      {
        auth: {
          jwtAccessToken: true,
          rolePermissions: true,
        },
        anotherDocs,
      },
    ),
  );
}

export function UserDeleteDoc(anotherDocs?: IAnotherDocs[]): MethodDecorator {
  return applyDecorators(
    Docs<void>(
      USER_MESSAGE_RESPONSE.USER_DELETED_SUCCESSFULLY,
      '/users/:id',
      HttpStatus.OK,
      {
        auth: {
          jwtAccessToken: true,
          rolePermissions: true,
        },
        anotherDocs,
      },
    ),
  );
}

export function UserRestoreDoc(anotherDocs?: IAnotherDocs[]): MethodDecorator {
  return applyDecorators(
    Docs<void>(
      USER_MESSAGE_RESPONSE.USER_RESTORED_SUCCESSFULLY,
      '/users/:id',
      HttpStatus.OK,
      {
        auth: {
          jwtAccessToken: true,
          rolePermissions: true,
        },
        anotherDocs,
      },
    ),
  );
}
