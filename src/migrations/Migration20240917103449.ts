import { Migration } from '@mikro-orm/migrations'

export class Migration20240917103449 extends Migration {
    async up(): Promise<void> {
        this.addSql('alter table "patient" add column "archived" boolean not null default false;')
    }

    async down(): Promise<void> {
        this.addSql('alter table "patient" drop column "archived";')
    }
}
