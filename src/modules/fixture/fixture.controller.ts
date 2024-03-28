import { Controller, Get } from '@nestjs/common'
import { FixtureService } from './fixture.service'

@Controller('fixtures')
export class FixtureController {
    constructor(private fixtureService: FixtureService) {}

    // todo protect with token
    @Get('reset')
    async resetFixtures() {
        await this.fixtureService.resetFixtures()
    }
}
