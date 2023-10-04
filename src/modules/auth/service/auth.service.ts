import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as jwt from 'jsonwebtoken';
import { RoleType, UserType } from 'src/common/type';
import { UserEntity } from 'src/modules/user/entitites';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}
  generateJwt(user: UserEntity): any {
    return this.jwtService.signAsync(
      {
        id: user.id,
        username: user.username,
        email: user.email,
        userType: user.userType,
        role: user.role,
        title: user.title ?? null,
        organization: user.organization
          ? {
              id: user.organization.id,
              name: user.organization.name,
              serviceName: user.organization.serviceName,
              shortName: user.organization.shortName,
              area: user.organization.area,
              areaNumber: user.organization.areaNumber,
            }
          : null,
      },
      { secret: this.configService.get('SECRET_KEY') },
    );
  }
  decodeUser(jwttoken): any {
    return jwt.verify(jwttoken, this.configService.get('SECRET_KEY'));
  }

  lovRoleType(userType?: UserType): any {
    const result = [];
    Object.keys(RoleType).forEach((e) => {
      if (userType && e.includes(userType)) {
        result.push(RoleType[e]);
      } else if (!userType) {
        result.push(RoleType[e]);
      }
    });
    return result;
  }
}
