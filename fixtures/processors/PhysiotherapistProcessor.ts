import { IProcessor } from 'typeorm-fixtures-cli'
import { Physiotherapist } from '../../src/entities/physiotherapist.entity'
import { randomBytes, scryptSync } from 'crypto'

function genSalt() {
    return randomBytes(128).toString('base64')
}

function hashPassword(password: string) {
    return scryptSync(password, genSalt(), 64).toString('hex')
}

export default class PhysiotherapistProcessor implements IProcessor<Physiotherapist> {
    postProcess(_name: string, object: { [key: string]: any }): void {
        const { password } = object
        object.password = hashPassword(password)
    }
}
