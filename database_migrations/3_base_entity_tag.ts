import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(
    'base_entity_tag',
    (tableBuilder: Knex.TableBuilder) => {

      tableBuilder.primary(['person_id', 'club_id'], 'id');
      tableBuilder.uuid('tagId').notNullable().references('tag.id').index('tag_id_index');
      tableBuilder
        .uuid('baseEntityId')
        .notNullable()
        .references('base_entity.id').index('base_entity_id_index');
    },
  );
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('base_entity');
}
