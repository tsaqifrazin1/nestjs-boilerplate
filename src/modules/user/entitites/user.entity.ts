import { Exclude } from 'class-transformer';
import { RoleType, UserType } from '../../../common/type';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OrganizationEntity } from '../../../modules/organizations/entities';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: UserType,
  })
  userType: UserType;

  @Column({
    unique: true,
  })
  username: string;

  @Column({
    nullable: true,
  })
  phoneNumber: string;

  @Exclude()
  @Column()
  password: string;

  @Column({
    unique: true,
  })
  email: string;

  @Column({
    type: 'enum',
    enum: RoleType,
  })
  role: RoleType;

  @Column({
    nullable: true,
  })
  title: string;

  @Column({
    nullable: true,
  })
  shortTitle: string;

  @ManyToOne(
    () => OrganizationEntity,
    (organization: OrganizationEntity) => organization.users,
    {
      nullable: true,
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn()
  organization: OrganizationEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn({
    nullable: true,
  })
  updatedAt: Date;

  @Exclude()
  @DeleteDateColumn({
    nullable: true,
  })
  deletedAt: Date;
}
