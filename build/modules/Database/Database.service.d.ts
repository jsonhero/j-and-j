export declare class DatabaseService {
    private static readonly logger;
    private static readonly knexMigrations;
    private static readonly knexConfig;
    private static _knex;
    private static getKnex;
    static closeKnex(): Promise<void>;
    constructor();
    runMigrations(): Promise<void>;
    isFullyMigrated(): Promise<boolean>;
    isHealthy(): Promise<boolean>;
}
