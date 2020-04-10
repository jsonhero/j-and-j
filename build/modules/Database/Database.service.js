"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var DatabaseService_1;
Object.defineProperty(exports, "__esModule", { value: true });
const Knex = require("knex");
const common_1 = require("@nestjs/common");
const utils_1 = require("../../utils");
const models_1 = require("../../models");
let DatabaseService = DatabaseService_1 = class DatabaseService {
    constructor() {
        if (!models_1.DatabaseRootModel.knex()) {
            models_1.DatabaseRootModel.knex(DatabaseService_1.getKnex());
        }
    }
    static async closeKnex() {
        if (DatabaseService_1._knex) {
            await DatabaseService_1._knex.destroy();
            DatabaseService_1._knex = undefined;
        }
    }
    async runMigrations() {
        DatabaseService_1.logger.verbose(`Running migrations.`);
        await DatabaseService_1.getKnex().migrate.latest(DatabaseService_1.knexMigrations);
    }
    async isFullyMigrated() {
        DatabaseService_1.logger.verbose(`Checking migration status.`);
        try {
            const status = await DatabaseService_1.getKnex().migrate.status(DatabaseService_1.knexMigrations);
            DatabaseService_1.logger.verbose(`\tknex_migrations table status: ${status}`);
            return status >= 0;
        }
        catch (error) {
            const doesNotExist = error.message.includes('relation "knex_migrations" does not exist');
            DatabaseService_1.logger.verbose(`\tErrored querying migration status: ${error.message}. Does not exist: ${doesNotExist}`);
            if (doesNotExist) {
                return false;
            }
            throw error;
        }
    }
    async isHealthy() {
        DatabaseService_1.logger.verbose(`Checking database connection health with a "SELECT 1;"`);
        try {
            const ping = await DatabaseService_1.getKnex().raw('SELECT 1 AS pong;');
            DatabaseService_1.logger.verbose(`\tSelect 1 result: ${ping.rows[0].pong}`);
            return true;
        }
        catch (error) {
            DatabaseService_1.logger.verbose(`\tSelect 1 failed: ${error}`);
            return false;
        }
    }
};
DatabaseService.logger = new utils_1.NamedLogger(DatabaseService_1.name);
DatabaseService.knexMigrations = {
    directory: `${__dirname}/../../../database_migrations`,
    tableName: 'knex_migrations',
    loadExtensions: ['.js'],
};
DatabaseService.knexConfig = {
    client: 'pg',
    connection: {
        host: process.env.DATABASE_HOST,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_SCHEMA,
        port: parseInt(process.env.DATABASE_PORT),
    },
    migrations: DatabaseService_1.knexMigrations,
};
DatabaseService._knex = Knex(DatabaseService_1.knexConfig);
DatabaseService.getKnex = () => DatabaseService_1._knex ||
    (DatabaseService_1._knex = Knex(DatabaseService_1.knexConfig));
DatabaseService = DatabaseService_1 = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [])
], DatabaseService);
exports.DatabaseService = DatabaseService;
//# sourceMappingURL=Database.service.js.map