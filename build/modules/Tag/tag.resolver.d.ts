import { NewTagInput } from './dto/newTag.input';
import { TagArgs } from './dto/tag.args';
import { Tag } from './models/tag.model';
import { TagService } from './tag.service';
export declare class TagResolver {
    private readonly tagService;
    constructor(tagService: TagService);
    tags(args: TagArgs): Promise<Tag[]>;
    createTag(newTagData: NewTagInput): Promise<Tag>;
}
