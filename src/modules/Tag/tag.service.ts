import { Injectable } from '@nestjs/common';
import * as uuid from 'uuid/v4';

import { TagArgs } from './dto/tag.args';
import { NewTagInput } from './dto/newTag.input'; 
import { Tag } from './models/tag.model';
import { TagModel } from '../../models';


@Injectable()
export class TagService {
  async create(data: NewTagInput): Promise<Tag> {
    const createdTag = TagModel.query().insert({ id: uuid(), ...data });
    return createdTag;
  }

  async findOneById(id: string): Promise<Tag> {
    return {} as any;
  }

  async findAll(args: TagArgs): Promise<Tag[]> {
    return TagModel.query().eager('*');
  }

  async remove(id: string): Promise<boolean> {
    return true;
  }
}
