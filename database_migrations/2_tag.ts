import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('tag', (tableBuilder: Knex.TableBuilder) => {
    tableBuilder.uuid('id').primary();
    tableBuilder.string('name', 32).notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('tag');
}
