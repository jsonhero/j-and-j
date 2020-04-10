"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const yn = require("yn");
const dotenv_1 = require("./dotenv");
async function main() {
    dotenv_1.dotEnvironment();
    const migrations = yn(process.env.ENABLE_DB_MIGRATIONS);
    const application = yn(process.env.ENABLE_API);
    const repl = yn(process.env.ENABLE_REPL);
    const closeKnexAfterMigration = !application && !repl;
    let app;
    if (migrations) {
        await require('./database').migrations(closeKnexAfterMigration);
    }
    if (application) {
        app = await require('./application').bootstrap();
    }
    if (repl) {
        await require('./repl').startRepl({ app });
    }
}
main()
    .then()
    .catch((error) => {
    console.error(error);
    process.exit(1);
});
//# sourceMappingURL=main.js.map