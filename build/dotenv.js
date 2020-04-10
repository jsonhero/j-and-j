"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
const dotenvExpand = require("dotenv-expand");
const utils_1 = require("./utils");
function dotEnvironment() {
    const NODE_ENV = process.env.NODE_ENV.toLowerCase();
    const appDirectory = fs.realpathSync(process.cwd());
    const dotenvFilePath = path.resolve(appDirectory, '.env');
    const dotenvFiles = [
        `${dotenvFilePath}.${NODE_ENV}.local`,
        `${dotenvFilePath}.${NODE_ENV}`,
        NODE_ENV !== 'test' && `${dotenvFilePath}.local`,
        dotenvFilePath,
    ].filter(Boolean);
    const propsConfigured = {};
    dotenvFiles.forEach((dotenvFile) => {
        if (fs.existsSync(dotenvFile)) {
            const { parsed } = dotenvExpand(dotenv.config({ path: dotenvFile }));
            Object.assign(propsConfigured, parsed);
        }
    });
    const logger = new utils_1.NamedLogger('Dotenv');
    logger.debug('Environment variables loaded from dotenvs: ', Object.keys(propsConfigured).length);
}
exports.dotEnvironment = dotEnvironment;
//# sourceMappingURL=dotenv.js.map