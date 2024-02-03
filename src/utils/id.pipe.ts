import { PipeTransform, Injectable } from '@nestjs/common';
import { idDecrypt } from './confuse';

@Injectable()
export class IdPipe implements PipeTransform<string, string> {
  transform(value: string): string {
    return idDecrypt(value);
  }
}
