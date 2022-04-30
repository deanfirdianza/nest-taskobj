import { Exclude } from 'class-transformer';

export class UserEntity {
  id: number;
  name: string;
  email: string;

  @Exclude()
  password: string;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
