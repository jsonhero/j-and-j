"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const graphql_1 = require("@nestjs/graphql");
const path = require("path");
const Database_1 = require("./Database");
const Tag_1 = require("./Tag");
let App = class App {
};
App = __decorate([
    common_1.Module({
        imports: [
            Database_1.DatabaseModule,
            Tag_1.TagModule,
            graphql_1.GraphQLModule.forRoot({
                debug: true,
                playground: true,
                autoSchemaFile: path.join(__dirname, './schema.gql'),
            }),
        ],
    })
], App);
exports.App = App;
//# sourceMappingURL=App.module.js.map