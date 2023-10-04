import { ClassConstructor, ClassTransformOptions } from 'class-transformer';

export interface IResponse<T> {
  message: string;
  statusCode?: number;
  data?: T | T[];
  requestUrl?: string;
}

export interface IResponseDecoratorOptions<T> {
  serialization?: ClassConstructor<T>;
  serializationOptions?: ClassTransformOptions;
}
