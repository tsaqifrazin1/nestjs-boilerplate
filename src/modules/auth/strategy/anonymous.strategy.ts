import { ArgumentsHost, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-anonymous';

@Injectable()
export class AnonymousStrategy extends PassportStrategy(Strategy, 'anonymous') {
  constructor() {
    super();
  }

  authenticate(host: ArgumentsHost) {
    if ((host as any).headers.authorization)
      return (this as any).fail('Unauthorized', 401);
    return (this as any).success({});
  }
}
