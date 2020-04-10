import { RelationMappings } from 'objection';

import { DatabaseRootModel } from './DatabaseRootModel';

export class BaseEntity extends DatabaseRootModel {
  readonly id: string;
  readonly type: string;
  readonly source: string;

  static tableName = 'base_entity';

  static jsonSchema = {
    type: 'object',
    required: ['id', 'name'],
    properties: {
      id: { type: 'string', format: 'uuid' },
      type: { type: 'string', minLength: 1, maxLength: 20 },
      source: { type: 'string', minLength: 1, maxLength: 255 },
    },
    additionalProperties: false,
  };

  static relationMappings: RelationMappings = {
    tags: {
      relation: DatabaseRootModel.ManyToManyRelation,
      modelClass: 'Tag',
      join: {
        from: 'base_entity.id',
        through: {
          from: 'base_entity_tag.base_entity_id',
          to: 'base_entity_tag.tag_id',
        },
        to: 'tag.id',
      },
    },
  };
}
