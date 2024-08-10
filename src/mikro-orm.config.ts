import { SqlHighlighter } from '@mikro-orm/sql-highlighter'
import { TsMorphMetadataProvider } from '@mikro-orm/reflection'
import { Migrator } from '@mikro-orm/migrations'
import { SeedManager } from '@mikro-orm/seeder'
import { defineConfig } from '@mikro-orm/postgresql'
import { SoftDeleteHandler } from 'mikro-orm-soft-delete'

export default defineConfig({
    host: process.env.MIKRO_ORM_HOST,
    // port: parseInt(process.env.MIKRO_ORM_PORT),
    user: process.env.MIKRO_ORM_USER,
    password: process.env.MIKRO_ORM_PASSWORD,
    dbName: process.env.MIKRO_ORM_DB_NAME,
    entities: ['dist/**/*.entity.js'],
    entitiesTs: ['src/**/*.entity.ts'],
    debug: true,
    highlighter: new SqlHighlighter(),
    metadataProvider: TsMorphMetadataProvider,
    // @ts-expect-error nestjs adapter option
    registerRequestContext: false,
    extensions: [Migrator, SeedManager, SoftDeleteHandler],
})
