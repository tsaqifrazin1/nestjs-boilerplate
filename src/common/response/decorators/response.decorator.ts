import { applyDecorators, UseInterceptors, SetMetadata } from '@nestjs/common';
import { ClassConstructor } from 'class-transformer';
import { TransformResponseInterceptor } from 'src/interceptors';
import { IResponseDecoratorOptions } from '../interfaces';

export function Response<T>(
  options?: IResponseDecoratorOptions<T>,
): MethodDecorator {
  return applyDecorators(
    UseInterceptors(TransformResponseInterceptor<T>),
    SetMetadata(
      'ResponseSerializationMetaKey',
      options ? options.serialization : undefined,
    ),
    SetMetadata(
      'ResponseSerializationOptionsMetaKey',
      options ? options.serializationOptions : undefined,
    ),
  );
}
