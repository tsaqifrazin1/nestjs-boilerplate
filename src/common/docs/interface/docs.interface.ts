import { ClassConstructor } from 'class-transformer';

export interface IDocs<T> {
  message: string;
  statusCode?: number;
  data?: T | T[];
  requestUrl?: string;
}

export interface IBaseDocsOptions<T> {
  data?: ClassConstructor<T>;
  isArray?: boolean;
  description?: string;
  isPrimitive?: boolean;
  primitiveData?: string;
  isPagination?: boolean;
}

export interface IAuthDocsOptions {
  jwtAccessToken?: boolean;
  rolePermissions?: boolean;
}

export interface IDocsOptions<T> {
  response?: IBaseDocsOptions<T>;
  auth?: IAuthDocsOptions;
  anotherDocs?: IAnotherDocs[];
}

export type IAnotherDocs = Pick<
  IDocsDefault<void>,
  'message' | 'statusCode' | 'requestUrl'
> &
  Pick<IBaseDocsOptions<void>, 'description'>;

export interface IDocsDefault<T> {
  message: string | string[];
  statusCode?: number;
  requestUrl?: string;
  options?: IDocsOptions<T>;
}
