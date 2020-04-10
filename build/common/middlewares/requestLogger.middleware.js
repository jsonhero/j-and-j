"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const logger = new utils_1.NamedLogger('Request');
function filterHeaders(headers) {
    const filteredHeaders = {};
    Object.entries(headers).forEach(([header, value]) => {
        if (header.includes('trace') || header.includes('transaction')) {
            filteredHeaders[header] = value;
        }
    });
    return filteredHeaders;
}
function requestLoggerMiddleware(req, res, next) {
    const { method, url, ip, headers } = req;
    logger.info({ method, url, ip }, filterHeaders(headers));
    return next();
}
exports.requestLoggerMiddleware = requestLoggerMiddleware;
//# sourceMappingURL=requestLogger.middleware.js.map