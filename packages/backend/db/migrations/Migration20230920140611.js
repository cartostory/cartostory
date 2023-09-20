'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const { Migration } = require('@mikro-orm/migrations')

class Migration20230920140611 extends Migration {
  async up() {
    this.addSql(
      "insert into \"cartostory\".\"user_status\" (status) VALUES ('registered'), ('verified'), ('deleted')",
    )
  }

  async down() {
    this.addSql('TRUNCATE TABLE "cartostory"."user_status"')
  }
}
exports.Migration20230920140611 = Migration20230920140611
