"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DatabaseRootModel_1 = require("./DatabaseRootModel");
class BaseEntityTag extends DatabaseRootModel_1.DatabaseRootModel {
}
exports.BaseEntityTag = BaseEntityTag;
BaseEntityTag.tableName = 'base_entity_tag';
BaseEntityTag.jsonSchema = {
    type: 'object',
    required: ['personId', 'clubId'],
    properties: {
        tagId: { type: 'string', format: 'uuid' },
        baseEntityId: { type: 'string', format: 'uuid' },
    },
    additionalProperties: false,
};
BaseEntityTag.relationMappings = {
    tag: {
        relation: DatabaseRootModel_1.DatabaseRootModel.BelongsToOneRelation,
        modelClass: 'Tag',
        join: {
            from: 'base_entity_tag.tag_id',
            to: 'tag.id',
        },
    },
    baseEntity: {
        relation: DatabaseRootModel_1.DatabaseRootModel.BelongsToOneRelation,
        modelClass: 'BaseEntity',
        join: {
            from: 'base_entity_tag.base_entity_id',
            to: 'base_entity.id',
        },
    },
};
//# sourceMappingURL=BaseEntityTag.js.map