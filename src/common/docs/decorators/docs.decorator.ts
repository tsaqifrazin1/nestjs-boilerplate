import { HttpStatus, applyDecorators } from '@nestjs/common';
import {
  ApiConsumes,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiFoundResponse,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import {
  SchemaObject,
  ReferenceObject,
} from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { ClassConstructor } from 'class-transformer';
import { IBaseDocsOptions, IDocsDefault, IDocsOptions } from '../interface';
import { number } from 'joi';

export function Docs<T>(
  message: string,
  requestUrl?: string,
  statusCode?: number,
  options?: IDocsOptions<T>,
): MethodDecorator {
  const unauthorized = [];
  if (options?.auth?.jwtAccessToken) {
    unauthorized.push(
      BaseDocs('Unauthorized', HttpStatus.UNAUTHORIZED, requestUrl, {
        description: 'Jwt access token is missing or invalid',
      }),
    );
  }

  const forbidden = [];
  if (options?.auth?.rolePermissions) {
    forbidden.push(
      BaseDocs('Forbidden Resources', HttpStatus.FORBIDDEN, requestUrl, {
        description: 'Role is not allowed to access this resources',
      }),
    );
  }

  const anotherDocs = [];
  if (options?.anotherDocs) {
    anotherDocs.push(
      ...options.anotherDocs.map((response) =>
        BaseDocs(response.message, response.statusCode, response.requestUrl, {
          description: response?.description,
        }),
      ),
    );
  }

  return applyDecorators(
    BaseDocs(
      'Internal server error',
      HttpStatus.INTERNAL_SERVER_ERROR,
      requestUrl,
      { description: 'Server error' },
    ),
    BaseDocs('Request timeout', HttpStatus.REQUEST_TIMEOUT, requestUrl, {
      description: 'Request timeout',
    }),
    BaseDocs(
      ['constraint errors mesage', '...', '...'],
      HttpStatus.BAD_REQUEST,
      requestUrl,
      { description: 'Error From Request Validations' },
    ),
    BaseDocs(message, statusCode, null, options.response),
    ...unauthorized,
    ...forbidden,
    ...anotherDocs,
  );
}

function GetBaseDocs(
  message: string | string[],
  statusCode: number,
): Record<string, SchemaObject | ReferenceObject> {
  const properties: Record<string, SchemaObject | ReferenceObject> = {
    message: {
      type: message instanceof Array ? 'array' : 'string',
      example: message,
    },
  };
  if (statusCode !== undefined) {
    properties['statusCode'] = {
      type: 'number',
      example: statusCode,
    };
  }
  return {
    properties,
  };
}

function BaseDocs<T>(
  message: string | string[],
  statusCode: number,
  requestUrl?: string,
  options?: IBaseDocsOptions<T>,
): MethodDecorator {
  const docs = [];
  const schema: Record<string, any> = GetBaseDocs(message, statusCode);
  schema.descriptions = 'success response';

  if (options?.data) {
    if (options?.isArray) {
      const isPrimitive = options?.isPrimitive ?? false;
      const isPagination = options?.isPagination ?? false;
      docs.push(ApiExtraModels(options?.data));
      const items = isPrimitive
        ? {
            type: options?.primitiveData,
          }
        : {
            $ref: getSchemaPath(options?.data),
          };
      const data = isPagination
        ? {
            type: 'object',
            properties: {
              entities: {
                type: 'array',
                items,
              },
              meta: {
                type: 'object',
                properties: {
                  page: {
                    type: 'number',
                  },
                  offset: {
                    type: 'number',
                  },
                  itemCount: {
                    type: 'number',
                  },
                  pageCount: {
                    type: 'number',
                  },
                },
              },
            },
          }
        : {
            type: 'array',
            items,
          };
      schema.properties.data = data;
    } else {
      docs.push(ApiExtraModels(options?.data));
      schema.properties.data = {
        $ref: getSchemaPath(options?.data),
      };
    }
  }

  if (requestUrl) {
    schema.properties.requestUrl = {
      type: 'string',
      example: requestUrl,
    };
  }

  return applyDecorators(
    ApiConsumes('application/json'),
    ApiResponse({
      status: statusCode,
      schema,
      description: options?.description ?? 'Success Response',
    }),
    ...docs,
  );
}
