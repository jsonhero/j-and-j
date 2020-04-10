import { ColumnNameMappers, Model } from 'objection';
export declare class DatabaseRootModel extends Model {
    static get columnNameMappers(): ColumnNameMappers;
    static get modelPaths(): string[];
}
