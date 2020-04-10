import { RelationMappings } from 'objection';
import { DatabaseRootModel } from './DatabaseRootModel';
export declare class Tag extends DatabaseRootModel {
    readonly id: string;
    readonly name: string;
    static tableName: string;
    static jsonSchema: {
        type: string;
        required: string[];
        properties: {
            id: {
                type: string;
                format: string;
            };
            name: {
                type: string;
                minLength: number;
                maxLength: number;
            };
        };
        additionalProperties: boolean;
    };
    static relationMappings: RelationMappings;
}
