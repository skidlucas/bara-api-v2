import { genSaltSync, hashSync } from 'bcryptjs'

export function hashPassword(password: string) {
    return hashSync(password, genSaltSync())
}
