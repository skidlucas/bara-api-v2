import { Controller, Get } from '@nestjs/common'
import { FixtureService } from './fixture.service'
import { Public } from '../auth/public.decorator'

@Controller('fixtures')
export class FixtureController {
    constructor(private fixtureService: FixtureService) {}

    // todo protect with token
    @Get('reset')
    @Public()
    async resetFixtures() {
        await this.fixtureService.resetFixtures()
    }
}
