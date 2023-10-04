import {
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
export class ViraCallbackInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const ip = request.headers['x-forwarder-for'];

    const viraIp = process.env.VIRA_IP_ADDRESS;
    if (ip == viraIp) {
      return next.handle();
    } else {
      throw new ForbiddenException(
        "The IP address that made this request doesn't match with VIRA's IP address.",
      );
    }
  }
}
