import { ForbiddenException, Injectable } from '@nestjs/common'

@Injectable()
export class FixtureService {
    async resetFixtures() {
        if (process.env.ENVIRONMENT !== 'local') {
            return new ForbiddenException()
        }

        console.log('do something')
    }
}
