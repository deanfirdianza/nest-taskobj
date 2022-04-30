import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HashService {
  constructor(private configService: ConfigService) {}

  async exec(password): Promise<string> {
    try {
      const salt = await bcrypt.genSalt(+this.configService.get('HASH_SALT'));
      const hashed = await bcrypt.hash(password, salt);

      return hashed;
    } catch (e) {
      console.error('error', e);
    }
  }
}
