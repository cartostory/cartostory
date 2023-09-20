'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const { Migration } = require('@mikro-orm/migrations')

class Migration20230908185911 extends Migration {
  async up() {
    this.addSql('create schema if not exists "cartostory";')

    this.addSql(
      'create table "user_status" ("status" text not null, constraint "user_status_pkey" primary key ("status"));',
    )

    this.addSql(
      'create table "cartostory"."user" ("id" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "display_name" text not null, "email" text not null, "password" text not null, "signed_up_at" timestamptz(0) not null, "activated_at" timestamptz(0) null, "last_logged_in_at" timestamptz(0) null, "status" text not null, constraint "user_pkey" primary key ("id"));',
    )
    this.addSql(
      'alter table "cartostory"."user" add constraint "user_email_unique" unique ("email");',
    )

    this.addSql(
      'create table "cartostory"."story" ("id" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "slug" text not null, "story" jsonb not null, "user_id" varchar(255) not null, constraint "story_pkey" primary key ("id"));',
    )

    this.addSql(
      'create table "cartostory"."user_verification_code" ("user_id" varchar(255) not null, "verification_code" varchar(255) not null, "created_at" timestamptz(0) not null, "expires_at" timestamptz(0) not null, "used_at" timestamptz(0) null, constraint "user_verification_code_pkey" primary key ("user_id", "verification_code"));',
    )

    this.addSql(
      'alter table "cartostory"."user" add constraint "user_status_foreign" foreign key ("status") references "cartostory"."user_status" ("status") on update cascade;',
    )

    this.addSql(
      'alter table "cartostory"."story" add constraint "story_user_id_foreign" foreign key ("user_id") references "cartostory"."user" ("id") on update cascade;',
    )

    this.addSql(
      'alter table "cartostory"."user_verification_code" add constraint "user_verification_code_user_id_foreign" foreign key ("user_id") references "cartostory"."user" ("id") on update cascade;',
    )
  }

  async down() {
    this.addSql(
      'alter table "cartostory"."story" drop constraint "story_user_id_foreign";',
    )

    this.addSql(
      'alter table "cartostory"."user_verification_code" drop constraint "user_verification_code_user_id_foreign";',
    )

    this.addSql('drop table if exists "user_status" cascade;')

    this.addSql('drop table if exists "cartostory"."user" cascade;')

    this.addSql('drop table if exists "cartostory"."story" cascade;')

    this.addSql(
      'drop table if exists "cartostory"."user_verification_code" cascade;',
    )

    this.addSql('drop schema "cartostory";')
  }
}
exports.Migration20230908185911 = Migration20230908185911
