import { HttpStatus, applyDecorators } from '@nestjs/common';
import { Docs, IAnotherDocs } from 'src/common/docs';
import { ClassConstructor } from 'class-transformer';
import { ORGANIZATION_STATUS_CODE_ERRORS } from '../constants/organizations.status-code.constants';
import { ORGANIZATION_MESSAGE_RESPONSE } from '../constants/organizations.message.constants';

export function OrganizationCreateDoc(
  anotherDocs?: IAnotherDocs[],
): MethodDecorator {
  const docs: IAnotherDocs[] = [
    {
      statusCode:
        ORGANIZATION_STATUS_CODE_ERRORS.ORGANIZATION_AREA_ALREADY_EXISTS,
      message: ORGANIZATION_MESSAGE_RESPONSE.ORGANIZATION_AREA_ALREADY_EXISTS,
      description: 'Organization area already exists',
      requestUrl: '/organizations',
    },
    {
      statusCode:
        ORGANIZATION_STATUS_CODE_ERRORS.ORGANIZATION_AREA_NUMBER_ALREADY_EXISTS,
      message:
        ORGANIZATION_MESSAGE_RESPONSE.ORGANIZATION_AREA_NUMBER_ALREADY_EXISTS,
      description: 'Organization area number already exists',
      requestUrl: '/organizations',
    },
  ];
  return applyDecorators(
    Docs<void>(
      ORGANIZATION_MESSAGE_RESPONSE.ORGANIZATION_CREATED_SUCCESSFULLY,
      '/organizations',
      HttpStatus.CREATED,
      {
        auth: {
          jwtAccessToken: true,
          rolePermissions: true,
        },
        anotherDocs: [...docs, ...anotherDocs],
      },
    ),
  );
}

export function OrganizationReadAllDoc<T>(
  data: ClassConstructor<T>,
  anotherDocs?: IAnotherDocs[],
): MethodDecorator {
  return applyDecorators(
    Docs<T>(
      ORGANIZATION_MESSAGE_RESPONSE.ORGANIZATION_READ_ALL_SUCCESSFULLY,
      '/organizations',
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

export function OrganizationReadOneDoc<T>(
  data: ClassConstructor<T>,
  anotherDocs?: IAnotherDocs[],
): MethodDecorator {
  return applyDecorators(
    Docs<T>(
      ORGANIZATION_MESSAGE_RESPONSE.ORGANIZATION_READ_ONE_SUCCESSFULLY,
      '/organizations/:id',
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

export function OrganizationUpdateDoc(
  anotherDocs?: IAnotherDocs[],
): MethodDecorator {
  return applyDecorators(
    Docs<void>(
      ORGANIZATION_MESSAGE_RESPONSE.ORGANIZATION_UPDATED_SUCCESSFULLY,
      '/organizations/:id',
      HttpStatus.OK,
      {
        auth: {
          jwtAccessToken: true,
          rolePermissions: true,
        },
        anotherDocs: [
          ...anotherDocs,
          {
            statusCode:
              ORGANIZATION_STATUS_CODE_ERRORS.ORGANIZATION_AREA_ALREADY_EXISTS,
            message:
              ORGANIZATION_MESSAGE_RESPONSE.ORGANIZATION_AREA_ALREADY_EXISTS,
            description:
              ORGANIZATION_MESSAGE_RESPONSE.ORGANIZATION_AREA_ALREADY_EXISTS,
            requestUrl: '/organizations',
          },
          {
            statusCode:
              ORGANIZATION_STATUS_CODE_ERRORS.ORGANIZATION_AREA_NUMBER_ALREADY_EXISTS,
            message:
              ORGANIZATION_MESSAGE_RESPONSE.ORGANIZATION_AREA_NUMBER_ALREADY_EXISTS,
            description:
              ORGANIZATION_MESSAGE_RESPONSE.ORGANIZATION_AREA_NUMBER_ALREADY_EXISTS,
            requestUrl: '/organizations',
          },
        ],
      },
    ),
  );
}

export function OrganizationDeleteDoc(
  anotherDocs?: IAnotherDocs[],
): MethodDecorator {
  return applyDecorators(
    Docs<void>(
      ORGANIZATION_MESSAGE_RESPONSE.ORGANIZATION_DELETED_SUCCESSFULLY,
      '/organizations/:id',
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
