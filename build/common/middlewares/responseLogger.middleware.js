"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const logger = new utils_1.NamedLogger('Response');
function logResponse(res, time) {
    const logInfo = {
        time,
        statusCode: res.statusCode,
    };
    logger.info('Response in', logInfo);
}
function responseLoggerMiddleware(req, res, next) {
    const startTime = Date.now();
    res.once('finish', () => {
        const endTime = Date.now();
        logResponse(res, endTime - startTime);
    });
    return next();
}
exports.responseLoggerMiddleware = responseLoggerMiddleware;
//# sourceMappingURL=responseLogger.middleware.js.map