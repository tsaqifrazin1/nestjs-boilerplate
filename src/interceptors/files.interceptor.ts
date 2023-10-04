import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import * as dotenv from 'dotenv';
import { Request } from 'express';
dotenv.config();

@Injectable()
export class FilesArrayInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const files = request.files as Express.Multer.File[];
    const arrayFile: Map<number, Express.Multer.File | null> = new Map();
    const regex = /file\[(\d+)\]/;
    files.map((file) => {
      const cek = file.fieldname.match(regex);
      if (cek === null) {
        throw new BadRequestException(
          'File fieldname must be file[0], file[1], etc. Use Postman for testing.',
        );
      }
      arrayFile.set(Number(cek[1]), file);
    });
    delete request.body.file;
    request.body.files = arrayFile;
    arrayFile.forEach((value, key) => {
      console.log(key, value);
    });
    return next.handle();
  }
}
