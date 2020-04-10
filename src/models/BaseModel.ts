import { ColumnNameMappers, Model, snakeCaseMappers } from 'objection';

export class BaseModel extends Model {
  // Standard snake case database table names and column names
  //   models will use standard (java|type)script camelCase
  static get columnNameMappers(): ColumnNameMappers {
    return snakeCaseMappers();
  }

  // Allows for defining relationships with string names of other models
  //   https://vincit.github.io/objection.js/guide/relations.html#require-loops
  static get modelPaths(): string[] {
    return [__dirname];
  }
}
