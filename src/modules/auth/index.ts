import { Module } from '@nestjs/common';
import { JwtAuthGuard, JwtOrAnonymousAuthGuard } from './guard';
import { AnonymousStrategy, JwtStrategy } from './strategy';

import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [],
  controllers: [],
  providers: [
    JwtService,
    JwtAuthGuard,
    JwtStrategy,
    JwtOrAnonymousAuthGuard,
    AnonymousStrategy,
  ],
})
export class AuthModule {}
