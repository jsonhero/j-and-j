"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const repl = require("repl");
const models = require("./models");
const modules_1 = require("./modules");
const utils_1 = require("./utils");
function startRepl(options = {}) {
    const logger = new utils_1.NamedLogger('Repl');
    logger.info(`Repl interface enabled: Starting...`);
    logger.info(` Globals available to you:`);
    logger.info(` $ app\tThe nest app instance (if APi is enabled, otherwise undefined)`);
    logger.info(` $ knex\tKnex instance to the database for running queries`);
    logger.info(` $ models\tObjection models. ex: "models.NAME.query()"`);
    logger.info(` $ a\t\tA function you can pass anything into and it will log resolved promise values.`);
    logger.info(` \t\t\tEx. "a(models.NAME.query());`);
    if (!models.DatabaseRootModel.knex()) {
        logger.verbose('Knex instance not detected, creating a database service for use in the Repl');
        new modules_1.DatabaseService();
    }
    const additionalContext = {
        app: options.app,
    };
    additionalContext.models = models;
    additionalContext.knex = models.DatabaseRootModel.knex();
    additionalContext.a = (...args) => {
        if (args) {
            console.time('Promise time:');
            const result = Promise.all(args);
            result.then((data) => {
                console.log(...data);
                console.timeEnd('Promise time:');
                additionalContext.a.data = data.length === 1 ? data[0] : data;
            });
            return `After result is logged, the data will be available in "a.data"`;
        }
    };
    const replServer = repl.start({
        breakEvalOnSigint: true,
        prompt: '',
    });
    replServer.on('exit', async () => {
        if (options.app) {
            await options.app.close();
        }
        await modules_1.DatabaseService.closeKnex();
    });
    Object.assign(replServer.context, additionalContext);
    return replServer;
}
exports.startRepl = startRepl;
//# sourceMappingURL=repl.js.map