import { TagArgs } from './dto/tag.args';
import { NewTagInput } from './dto/newTag.input';
import { Tag } from './models/tag.model';
export declare class TagService {
    create(data: NewTagInput): Promise<Tag>;
    findOneById(id: string): Promise<Tag>;
    findAll(args: TagArgs): Promise<Tag[]>;
    remove(id: string): Promise<boolean>;
}
