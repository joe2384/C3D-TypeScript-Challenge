import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("students", (table) => {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.string("email").notNullable();
    table.integer("graduation_year").notNullable();
    table.string("phone_number").notNullable();
    table.decimal("gpa", 3, 2).notNullable();
    table.string("city").notNullable();
    table.string("state").notNullable();
    table.decimal("latitude", 10, 7);
    table.decimal("longitude", 10, 7);
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("students");
}