"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DatabaseRootModel_1 = require("./DatabaseRootModel");
class BaseEntity extends DatabaseRootModel_1.DatabaseRootModel {
}
exports.BaseEntity = BaseEntity;
BaseEntity.tableName = 'base_entity';
BaseEntity.jsonSchema = {
    type: 'object',
    required: ['id', 'name'],
    properties: {
        id: { type: 'string', format: 'uuid' },
        type: { type: 'string', minLength: 1, maxLength: 20 },
        source: { type: 'string', minLength: 1, maxLength: 255 },
    },
    additionalProperties: false,
};
BaseEntity.relationMappings = {
    tags: {
        relation: DatabaseRootModel_1.DatabaseRootModel.ManyToManyRelation,
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
//# sourceMappingURL=BaseEntity.js.map