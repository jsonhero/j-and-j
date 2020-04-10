import { RelationMappings } from 'objection';
import { DatabaseRootModel } from './DatabaseRootModel';
export declare class BaseEntity extends DatabaseRootModel {
    readonly id: string;
    readonly type: string;
    readonly source: string;
    static tableName: string;
    static jsonSchema: {
        type: string;
        required: string[];
        properties: {
            id: {
                type: string;
                format: string;
            };
            type: {
                type: string;
                minLength: number;
                maxLength: number;
            };
            source: {
                type: string;
                minLength: number;
                maxLength: number;
            };
        };
        additionalProperties: boolean;
    };
    static relationMappings: RelationMappings;
}
