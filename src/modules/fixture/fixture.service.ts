import { ForbiddenException, Injectable } from '@nestjs/common'
import { DataSource } from 'typeorm'
import { Builder, fixturesIterator, Loader, Parser, Resolver } from 'typeorm-fixtures-cli'
import * as path from 'path'

@Injectable()
export class FixtureService {
    constructor(private dataSource: DataSource) {}
    async resetFixtures() {
        if (process.env.ENVIRONMENT !== 'local') {
            return new ForbiddenException()
        }

        await this.dataSource.synchronize(true)
        // await this.dataSource.runMigrations();

        const loader = new Loader()
        loader.load(path.resolve('./fixtures'))

        const resolver = new Resolver()
        const fixtures = resolver.resolve(loader.fixtureConfigs)
        const builder = new Builder(this.dataSource, new Parser(), false)

        for (const fixture of fixturesIterator(fixtures)) {
            const entity = await builder.build(fixture)
            await this.dataSource.getRepository(fixture.entity).save(entity)
        }
    }
}
