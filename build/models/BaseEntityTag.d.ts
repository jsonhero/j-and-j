import { DatabaseRootModel } from './DatabaseRootModel';
export declare class BaseEntityTag extends DatabaseRootModel {
    readonly tagId: string;
    readonly baseEntityId: string;
    static tableName: string;
    static jsonSchema: {
        type: string;
        required: string[];
        properties: {
            tagId: {
                type: string;
                format: string;
            };
            baseEntityId: {
                type: string;
                format: string;
            };
        };
        additionalProperties: boolean;
    };
    static relationMappings: {
        tag: {
            relation: import("objection").RelationType;
            modelClass: string;
            join: {
                from: string;
                to: string;
            };
        };
        baseEntity: {
            relation: import("objection").RelationType;
            modelClass: string;
            join: {
                from: string;
                to: string;
            };
        };
    };
}
