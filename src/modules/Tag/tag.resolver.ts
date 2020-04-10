import { Args, Query, Resolver, Mutation } from '@nestjs/graphql';
import { NewTagInput } from './dto/new-tag.input';
import { TagArgs } from './dto/tag.args';
import { Tag } from './models/tag.model';
import { TagService } from './tag.service';


@Resolver((of) => Tag)
export class TagResolver {
  constructor(private readonly tagService: TagService) {}

  @Query((returns) => [Tag])
  tags(@Args() args: TagArgs): Promise<Tag[]> {
    return this.tagService.findAll(args);
  }

  @Mutation((returns) => Tag)
  async createTag(
    @Args('newTagData') newTagData: NewTagInput,
  ): Promise<Tag> {
    const tag = await this.tagService.create(newTagData);
    return tag;
  }
}
