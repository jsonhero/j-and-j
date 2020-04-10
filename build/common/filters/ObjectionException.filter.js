"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const objection_1 = require("objection");
let ObjectionExceptionFilter = class ObjectionExceptionFilter {
    catch(exception, host) {
        return host.switchToHttp().getResponse().status(exception.statusCode).json(exception);
    }
};
ObjectionExceptionFilter = __decorate([
    common_1.Catch(objection_1.ValidationError, objection_1.NotFoundError)
], ObjectionExceptionFilter);
exports.ObjectionExceptionFilter = ObjectionExceptionFilter;
//# sourceMappingURL=ObjectionException.filter.js.map