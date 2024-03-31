import { IProcessor } from 'typeorm-fixtures-cli'
import { User } from '../../src/entities/user.entity'
import { genSaltSync, hashSync } from 'bcryptjs'

function hashPassword(password: string) {
    return hashSync(password, genSaltSync())
}

export default class UserProcessor implements IProcessor<User> {
    postProcess(_name: string, object: { [key: string]: any }): void {
        const { password } = object
        object.password = hashPassword(password)
    }
}
