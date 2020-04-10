import { RelationMappings } from 'objection';

import { DatabaseRootModel } from './DatabaseRootModel';

export class Tag extends DatabaseRootModel {
  readonly id: string;
  readonly name: string;

  static tableName = 'tag';

  static jsonSchema = {
    type: 'object',
    required: ['id', 'name'],
    properties: {
      id: { type: 'string', format: 'uuid' },
      name: { type: 'string', minLength: 1, maxLength: 32 },
    },
    additionalProperties: false,
  };

  static relationMappings: RelationMappings = {
    baseEntity: {
      relation: DatabaseRootModel.ManyToManyRelation,
      modelClass: 'BaseEntity',
      join: {
        from: 'tag.id',
        through: {
          from: 'base_entity_tag.tag_id',
          to: 'base_entity_tag.base_entity_id',
        },
        to: 'base_entity.id',
      },
    },
  };
}
