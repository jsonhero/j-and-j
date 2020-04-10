"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DatabaseRootModel_1 = require("./DatabaseRootModel");
class Tag extends DatabaseRootModel_1.DatabaseRootModel {
}
exports.Tag = Tag;
Tag.tableName = 'tag';
Tag.jsonSchema = {
    type: 'object',
    required: ['id', 'name'],
    properties: {
        id: { type: 'string', format: 'uuid' },
        name: { type: 'string', minLength: 1, maxLength: 32 },
    },
    additionalProperties: false,
};
Tag.relationMappings = {
    baseEntity: {
        relation: DatabaseRootModel_1.DatabaseRootModel.ManyToManyRelation,
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
//# sourceMappingURL=Tag.js.map