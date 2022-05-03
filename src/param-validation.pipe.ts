import { ArgumentMetadata, PipeTransform } from '@nestjs/common';

export class ParamValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    console.log(`value ${value} typeof ${typeof value}`);
    console.log('metadata ', metadata);

    return value;
  }
}
