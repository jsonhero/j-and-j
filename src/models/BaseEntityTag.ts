import { DatabaseRootModel } from './DatabaseRootModel';

export class BaseEntityTagModel extends DatabaseRootModel {
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
      relation: DatabaseRootModel.BelongsToOneRelation,
      modelClass: 'Tag',
      join: {
        from: 'base_entity_tag.tag_id',
        to: 'tag.id',
      },
    },
    baseEntity: {
      relation: DatabaseRootModel.BelongsToOneRelation,
      modelClass: 'BaseEntity',
      join: {
        from: 'base_entity_tag.base_entity_id',
        to: 'base_entity.id',
      },
    },
  };
}
