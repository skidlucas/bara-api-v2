import { IProcessor } from 'typeorm-fixtures-cli';
import { Physiotherapist } from '../../src/entities/physiotherapist.entity';
import { scryptSync, randomBytes } from 'crypto';

export default class PhysiotherapistProcessor
  implements IProcessor<Physiotherapist>
{
  postProcess(name: string, object: { [key: string]: any }): void {
    const salt = randomBytes(128).toString('base64');
    const { password } = object;
    object.password = scryptSync(password, salt, 64);
  }
}
