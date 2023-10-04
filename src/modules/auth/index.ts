import { Module } from '@nestjs/common';
import { JwtAuthGuard, JwtOrAnonymousAuthGuard } from './guard';
import { AnonymousStrategy, JwtStrategy } from './strategy';
import { AuthController } from './controller';
import { AuthService, LdapService } from './service';
import { UserModule } from '../user';
import { JwtService } from '@nestjs/jwt';
import { OrganizationsModule } from '../organizations';

@Module({
  imports: [UserModule, OrganizationsModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    LdapService,
    JwtService,
    JwtAuthGuard,
    JwtStrategy,
    JwtOrAnonymousAuthGuard,
    AnonymousStrategy,
  ],
})
export class AuthModule {}
