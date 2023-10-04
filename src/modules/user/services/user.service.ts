import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserEntity } from '../entitites';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto, UpdateUserDto, UserFilterDto } from '../dto';
import { RoleType, UserType } from 'src/common/type';
import * as bcrypt from 'bcrypt';
import { PaginationDto } from 'src/common/dto';

@Injectable()
export class UserService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createUser(user: CreateUserDto): Promise<void> {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(user.password, salt);
    user.password = hash;
    const newUser = this.userRepository.create(user);
    await this.userRepository.save(newUser);
  }

  async changePassword(id: number, password: string): Promise<void> {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    await this.userRepository.update(id, { password: hash });
  }

  async getUser(
    options: UserFilterDto,
    user?: UserEntity,
  ): Promise<UserEntity[]> {
    const queryBuilder = this.userRepository.createQueryBuilder('user');
    queryBuilder.leftJoinAndSelect('user.mitra', 'mitra');
    queryBuilder.leftJoinAndSelect('user.organization', 'organization');
    if (options.id) {
      queryBuilder.where(`user.id = :id`, { id: options.id });
    }
    if (options.username) {
      queryBuilder.andWhere(`user.username ilike '%${options.username}%'`);
    }
    if (options.email) {
      queryBuilder.andWhere(`user.email ilike '%${options.email}%'`);
    }
    if (options.role) {
      queryBuilder.andWhere('user.role = :role', { role: options.role });
    }
    if (options.mitraType) {
      queryBuilder.andWhere('mitra.mitraType = :mitraType', {
        mitraType: options.mitraType,
      });
    }
    if (options.mitraId) {
      queryBuilder.andWhere('mitra.id = :mitraId', {
        mitraId: options.mitraId,
      });
    }
    if (options.userType) {
      queryBuilder.andWhere('user.userType = :userType', {
        userType: options.userType,
      });
    }
    if (options.organizationId) {
      queryBuilder.andWhere('organization.id = :organizationId', {
        organizationId: options.organizationId,
      });
    }
    if (options.organizationName) {
      queryBuilder.andWhere(
        'organization.name ilike :organizationName or mitra.name ilike :organizationName',
        {
          organizationName: `%${options.organizationName}%`,
        },
      );
    }
    if (options.isLovSurveyor) {
      queryBuilder.where(
        'user.role = :role and organization.id = :organizationId or user.id = :userId',
        {
          role: RoleType.OUTSOURCE_SURVEYOR,
          organizationId: user.organization.id,
          userId: user.id,
        },
      );
    }
    return queryBuilder.getMany();
  }

  async getUserPagination(
    options: Partial<UserFilterDto>,
  ): Promise<PaginationDto<UserEntity>> {
    const queryBuilder = this.userRepository.createQueryBuilder('user');
    queryBuilder.leftJoinAndSelect('user.mitra', 'mitra');
    queryBuilder.leftJoinAndSelect('user.organization', 'organization');
    if (options.id) {
      queryBuilder.where(`user.id = :id`, { id: options.id });
    }
    if (options.username) {
      queryBuilder.andWhere(`user.username ilike '%${options.username}%'`);
    }
    if (options.email) {
      queryBuilder.andWhere(`user.email ilike '%${options.email}%'`);
    }
    if (options.role) {
      queryBuilder.andWhere('user.role = :role', { role: options.role });
    }
    queryBuilder.take(options.take);
    if ((options.page - 1) * options.take) {
      queryBuilder.skip((options.page - 1) * options.take);
    }
    const entities = await queryBuilder.getMany();
    const itemCount = await queryBuilder.getCount();

    const meta = {
      page: options.page,
      offset: options.take,
      itemCount,
      pageCount: Math.ceil(itemCount / options.take)
        ? Math.ceil(itemCount / options.take)
        : 0,
    };

    return {
      entities,
      meta,
    };
  }

  async getUserById(
    id: number,
    options?: Partial<{ withDeleted: boolean }>,
  ): Promise<UserEntity> {
    const queryBuilder = this.userRepository.createQueryBuilder('user');
    queryBuilder.leftJoinAndSelect('user.mitra', 'mitra');
    queryBuilder.leftJoinAndSelect('user.organization', 'organization');
    queryBuilder.where('user.id = :id', { id });

    if (options?.withDeleted) {
      queryBuilder.withDeleted();
    }

    const result = await queryBuilder.getMany();
    return result[0];
  }

  async getByUsername(username: string): Promise<UserEntity> {
    return this.userRepository.findOne({ where: { username } });
  }

  async getUserByEmailAndOrUserType(
    email: string,
    userType?: UserType,
  ): Promise<UserEntity> {
    const queryBuilder = this.userRepository.createQueryBuilder('user');
    queryBuilder.leftJoinAndSelect('user.mitra', 'mitra');
    queryBuilder.leftJoinAndSelect('user.organization', 'organization');
    queryBuilder.where('user.email = :email', { email });
    if (userType) {
      queryBuilder.andWhere('user.userType = :userType', { userType });
    }
    const result = await queryBuilder.getMany();
    return result[0];
  }

  async updateUser(
    id: number,
    updatedUser: UpdateUserDto,
  ): Promise<void> {
    await this.userRepository.update(id, { ...updatedUser });
  }

  async deleteUser(id: number): Promise<void> {
    await this.userRepository.softDelete(id);
  }

  async restoreUser(id: number): Promise<void> {
    await this.userRepository.restore(id);
  }

  async getTitleAndShortTitle(
    role: RoleType,
    area: string,
  ): Promise<{ title: string; shortTitle: string }> {
    let title, shortTitle;
    switch (role) {
      case RoleType.PLN_AMPP:
        title = 'ASSISTANT MANAGER PELAYANAN PELANGGAN';
        shortTitle = 'ASMAN YAN';
        break;
      case RoleType.PLN_AMPT:
        title = 'ASSISTANT MANAGER PELAYANAN PELANGGAN';
        shortTitle = 'ASMAN TEK';
        break;
      case RoleType.PLN_MUP3:
        title = 'MANAGER UNIT PELAKSANA PELAYANAN PELANGGAN';
        shortTitle = 'MUP3';
        break;
      default:
        title = null;
        shortTitle = null;
        break;
    }

    switch (area) {
      case 'TIBAN':
        title = `${title} TIBAN`;
        shortTitle =
          shortTitle === 'MUP3' ? `${shortTitle} TB` : `${shortTitle}TB`;
        break;
      case 'BATU AJI':
        title = `${title} BATU AJI`;
        shortTitle =
          shortTitle === 'MUP3' ? `${shortTitle} BA` : `${shortTitle}BA`;
        break;
      case 'BATAM CENTER':
        title = `${title} BATAM CENTER`;
        shortTitle =
          shortTitle === 'MUP3' ? `${shortTitle} BC` : `${shortTitle}BC`;
        break;
      case 'NAGOYA':
        title = `${title} NAGOYA`;
        shortTitle =
          shortTitle === 'MUP3' ? `${shortTitle} GY` : `${shortTitle}GY`;
        break;
      default:
        break;
    }

    return { title, shortTitle };
  }

  async onApplicationBootstrap() {
    const superadmin = await this.getByUsername('superadmin');
    if (!superadmin) {
      const user: CreateUserDto = {
        username: 'superadmin',
        password: 'Asdf1234.',
        email: 'superadmin@gmail.com',
        userType: UserType.PLN,
        phoneNumber: '0',
        role: RoleType.PLN_SUPERADMIN,
      };
      await this.createUser(user);
    }
    const admin = await this.getByUsername('admin');
    if (!admin) {
      const user: CreateUserDto = {
        username: 'admin',
        password: 'Asdf1234.',
        email: 'admin@gmail.com',
        userType: UserType.PLN,
        role: RoleType.PLN_ADMIN,
        phoneNumber: '0',
      };
      await this.createUser(user);
    }
  }
}
