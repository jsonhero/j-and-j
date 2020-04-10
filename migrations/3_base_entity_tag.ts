import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(
    'base_entity_tag',
    (tableBuilder: Knex.TableBuilder) => {

      tableBuilder.primary(['tag_id', 'base_entity_id'], 'id');
      tableBuilder.uuid('tag_id').notNullable().references('tag.id').index('tag_id_index');
      tableBuilder
        .uuid('base_entity_id')
        .notNullable()
        .references('base_entity.id').index('base_entity_id_index');
    },
  );
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('base_entity');
}
