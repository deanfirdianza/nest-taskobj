import { Injectable } from '@nestjs/common';

@Injectable()
export class DateService {}

export function toUnix(date): number {
  try {
    return Math.floor(new Date(date).getTime() / 1000);
  } catch (e) {
    console.error('error', e);
  }
}
