import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: string;
  @Column()
  username: string;
  @Column()
  hashPassword: string;
  @Column()
  email: string;
}
