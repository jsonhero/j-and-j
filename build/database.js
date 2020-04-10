"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const modules_1 = require("./modules");
const utils_1 = require("./utils");
async function migrations(closeKnexOnFinish = true) {
    const logger = new utils_1.NamedLogger('Migrations');
    logger.info('Database migrations enabled: Checking status of the database...');
    const databaseService = new modules_1.DatabaseService();
    if (await databaseService.isFullyMigrated()) {
        logger.info('Migrations are up to date, skipping migrations.');
    }
    else {
        logger.info('Migrations are out of date, running...');
        await databaseService.runMigrations();
        logger.info(`\tFinished migrating the database.`);
    }
    if (closeKnexOnFinish) {
        await modules_1.DatabaseService.closeKnex();
    }
}
exports.migrations = migrations;
//# sourceMappingURL=database.js.map