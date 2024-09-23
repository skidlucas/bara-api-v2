import { Migration } from '@mikro-orm/migrations'

export class Migration20240923130529 extends Migration {
    async up(): Promise<void> {
        this.addSql('alter table "patient" drop column "archived";')
    }

    async down(): Promise<void> {
        this.addSql('alter table "patient" add column "archived" boolean not null default false;')
    }
}
