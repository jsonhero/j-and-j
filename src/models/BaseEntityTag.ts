import { BaseModel } from './BaseModel';

export class BaseEntityTag extends BaseModel {
  readonly tagId: string;
  readonly baseEntityId: string;

  static tableName = 'base_entity_tag';

  static jsonSchema = {
    type: 'object',
    required: ['personId', 'clubId'],
    properties: {
      tagId: { type: 'string', format: 'uuid' },
      baseEntityId: { type: 'string', format: 'uuid' },
    },
    additionalProperties: false,
  };

  static relationMappings = {
    tag: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: 'Tag',
      join: {
        from: 'base_entity_tag.tag_id',
        to: 'tag.id',
      },
    },
    baseEntity: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: 'BaseEntity',
      join: {
        from: 'base_entity_tag.base_entity_id',
        to: 'base_entity.id',
      },
    },
  };
}
