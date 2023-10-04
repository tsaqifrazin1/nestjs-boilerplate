import { Exclude } from 'class-transformer';
import { UserEntity } from '../../../modules/user/entitites';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'organizations',
})
export class OrganizationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  serviceName: string;

  @Column()
  shortName: string;

  @Column({
    unique: true,
  })
  area: string;

  @Column({
    unique: true,
  })
  areaNumber: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Exclude()
  @DeleteDateColumn({
    nullable: true,
  })
  deletedAt: Date;

  @OneToMany(() => UserEntity, (user: UserEntity) => user.organization, {
    onDelete: 'CASCADE',
  })
  users: UserEntity[];
}
