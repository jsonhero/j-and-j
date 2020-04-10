import { Injectable } from '@nestjs/common';
import { TagArgs } from './dto/tag.args';
import { NewTagInput } from './dto/new-tag.input'; 
import { Tag } from './models/tag.model';
import { Tag as model } from '../../models';


@Injectable()
export class TagService {
  async create(data: NewTagInput): Promise<Tag> {
    const createdTag = model.query().insert({ ...data });
    return createdTag;
  }

  async findOneById(id: string): Promise<Tag> {
    return {} as any;
  }

  async findAll(args: TagArgs): Promise<Tag[]> {
    return model.query().eager('*');
  }

  async remove(id: string): Promise<boolean> {
    return true;
  }
}
