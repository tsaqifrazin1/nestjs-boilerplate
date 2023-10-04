import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  ClassConstructor,
  ClassTransformOptions,
  plainToClass,
  plainToInstance,
} from 'class-transformer';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IResponse } from 'src/common/response';

@Injectable()
export class TransformResponseInterceptor<T>
  implements NestInterceptor<T, IResponse<T>>
{
  constructor(private readonly reflector: Reflector) {}
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<IResponse<T>> {
    if (context.getType() === 'http') {
      return next.handle().pipe(
        map((responseData) => {
          const classSerialization: ClassConstructor<any> = this.reflector.get<
            ClassConstructor<any>
          >('ResponseSerializationMetaKey', context.getHandler());

          const classSerializationOptions: ClassTransformOptions =
            this.reflector.get<ClassTransformOptions>(
              'ResponseSerializationOptionsMetaKey',
              context.getHandler(),
            );

          const isPagination = responseData?.data?.entities?.length;
          let data = isPagination
            ? responseData?.data?.entities
            : responseData?.data;
          if (classSerialization) {
            data = plainToClass(
              classSerialization,
              isPagination ? responseData?.data?.entities : responseData?.data,
              classSerializationOptions,
            );
          }
          isPagination
            ? (responseData.data.entities = data)
            : (responseData.data = data);
          return {
            statusCode: context.switchToHttp().getResponse().statusCode,
            message: responseData.message || '',
            data: responseData?.data,
          };
        }),
      );
    }
    return next.handle();
  }
}
