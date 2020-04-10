import { SchemaDirectiveVisitor } from 'apollo-server';
import { GraphQLField } from 'graphql';
export declare class UpperCaseDirective extends SchemaDirectiveVisitor {
    visitFieldDefinition(field: GraphQLField<any, any>): void;
}
