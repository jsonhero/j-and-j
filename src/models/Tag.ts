import { RelationMappings } from 'objection';

import { BaseModel } from './BaseModel';

export class Tag extends BaseModel {
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
      relation: BaseModel.ManyToManyRelation,
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
