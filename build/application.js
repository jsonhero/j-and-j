"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const modules_1 = require("./modules");
const utils_1 = require("./utils");
const filters_1 = require("./filters");
const middlewares_1 = require("./middlewares");
async function bootstrap() {
    const logger = new utils_1.NamedLogger('Bootstrap');
    logger.info(`API enabled: Calling NestFactory create and app listen with port=${process.env.PORT}`);
    const app = await core_1.NestFactory.create(modules_1.App, {
        logger: new utils_1.NamedLogger('NestJS').asNestLoggerService(),
    });
    app.set('trust proxy', true);
    app.use(middlewares_1.requestLoggerMiddleware);
    app.useGlobalFilters(new filters_1.ObjectionExceptionFilter());
    app.use(middlewares_1.responseLoggerMiddleware);
    await app.listen(process.env.PORT);
    return app;
}
exports.bootstrap = bootstrap;
//# sourceMappingURL=application.js.map