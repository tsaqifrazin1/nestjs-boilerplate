import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtOrAnonymousAuthGuard extends AuthGuard(['jwt', 'anonymous']) {}
