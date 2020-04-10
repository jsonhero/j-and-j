import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('base_entity', (tableBuilder: Knex.TableBuilder) => {
    tableBuilder.uuid('id').primary();
    tableBuilder.string('type', 32).notNullable();
    tableBuilder.string('source', 32).notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('base_entity');
}