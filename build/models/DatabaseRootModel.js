"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const objection_1 = require("objection");
class DatabaseRootModel extends objection_1.Model {
    static get columnNameMappers() {
        return objection_1.snakeCaseMappers();
    }
    static get modelPaths() {
        return [__dirname];
    }
}
exports.DatabaseRootModel = DatabaseRootModel;
//# sourceMappingURL=DatabaseRootModel.js.map