// @ts-nocheck -- generated; drizzle `sql` types resolve to two declaration copies
import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "payload"."recruitment_notice_en_spots" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "payload"."recruitment_notice_nl_spots" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "payload"."recruitment_notice" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"en_title" varchar NOT NULL,
  	"en_intro" varchar NOT NULL,
  	"en_outro" varchar,
  	"nl_title" varchar NOT NULL,
  	"nl_intro" varchar NOT NULL,
  	"nl_outro" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "payload"."recruitment_notice_en_spots" ADD CONSTRAINT "recruitment_notice_en_spots_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."recruitment_notice"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."recruitment_notice_nl_spots" ADD CONSTRAINT "recruitment_notice_nl_spots_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."recruitment_notice"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "recruitment_notice_en_spots_order_idx" ON "payload"."recruitment_notice_en_spots" USING btree ("_order");
  CREATE INDEX "recruitment_notice_en_spots_parent_id_idx" ON "payload"."recruitment_notice_en_spots" USING btree ("_parent_id");
  CREATE INDEX "recruitment_notice_nl_spots_order_idx" ON "payload"."recruitment_notice_nl_spots" USING btree ("_order");
  CREATE INDEX "recruitment_notice_nl_spots_parent_id_idx" ON "payload"."recruitment_notice_nl_spots" USING btree ("_parent_id");`)

  // Seed the notice that was previously hardcoded, so the live site is unchanged.
  await db.execute(sql`
   INSERT INTO "payload"."recruitment_notice" ("id", "enabled", "en_title", "en_intro", "en_outro", "nl_title", "nl_intro", "nl_outro", "updated_at", "created_at") VALUES (
    1, true,
    'Mid-season update — Limited availability',
    'We are currently mid-season and recruiting is almost complete. Open spots are very limited:',
    'You are still welcome to fill out the form, but only candidates who are a good fit for these remaining spots may receive a response from our Technical Committee.

For other teams and levels, recruitment will reopen towards the end of this season (around May) or at the start of next season (around September).',
    'Update halverwege het seizoen — Beperkte beschikbaarheid',
    'We zitten momenteel halverwege het seizoen en de werving is bijna afgerond. Er zijn nog maar zeer beperkt plekken beschikbaar:',
    'Je bent nog steeds van harte welkom om het formulier in te vullen, maar alleen spelers die goed aansluiten bij deze openstaande plekken ontvangen mogelijk een reactie van onze Technische Commissie.

Voor andere teams en niveaus opent de werving weer aan het einde van dit seizoen (rond mei) of bij de start van volgend seizoen (rond september).',
    now(), now());
   INSERT INTO "payload"."recruitment_notice_en_spots" ("_order", "_parent_id", "id", "label", "text") VALUES
    (1, 1, 'seed-en-men', 'Men', 'H1 and free training members (recreational) who train at Du Midi hall.'),
    (2, 1, 'seed-en-women', 'Women', 'D1 and D6.');
   INSERT INTO "payload"."recruitment_notice_nl_spots" ("_order", "_parent_id", "id", "label", "text") VALUES
    (1, 1, 'seed-nl-men', 'Heren', 'H1 en vrije training (recreanten) die trainen in de Du Midi-hal.'),
    (2, 1, 'seed-nl-women', 'Dames', 'D1 en D6.');
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "payload"."recruitment_notice_en_spots" CASCADE;
  DROP TABLE "payload"."recruitment_notice_nl_spots" CASCADE;
  DROP TABLE "payload"."recruitment_notice" CASCADE;`)
}
