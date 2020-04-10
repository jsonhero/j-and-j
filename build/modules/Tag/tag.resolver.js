"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("@nestjs/graphql");
const newTag_input_1 = require("./dto/newTag.input");
const tag_args_1 = require("./dto/tag.args");
const tag_model_1 = require("./models/tag.model");
const tag_service_1 = require("./tag.service");
let TagResolver = class TagResolver {
    constructor(tagService) {
        this.tagService = tagService;
    }
    tags(args) {
        return this.tagService.findAll(args);
    }
    async createTag(newTagData) {
        const tag = await this.tagService.create(newTagData);
        return tag;
    }
};
__decorate([
    graphql_1.Query((returns) => [tag_model_1.Tag]),
    __param(0, graphql_1.Args()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [tag_args_1.TagArgs]),
    __metadata("design:returntype", Promise)
], TagResolver.prototype, "tags", null);
__decorate([
    graphql_1.Mutation((returns) => tag_model_1.Tag),
    __param(0, graphql_1.Args('newTagData')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [newTag_input_1.NewTagInput]),
    __metadata("design:returntype", Promise)
], TagResolver.prototype, "createTag", null);
TagResolver = __decorate([
    graphql_1.Resolver((of) => tag_model_1.Tag),
    __metadata("design:paramtypes", [tag_service_1.TagService])
], TagResolver);
exports.TagResolver = TagResolver;
//# sourceMappingURL=tag.resolver.js.map