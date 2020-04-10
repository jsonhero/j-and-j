import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import * as path from 'path';

import { DatabaseModule } from './Database';

// Graph modules
import { TagModule } from './Tag';

@Module({
  imports: [
    DatabaseModule,
    TagModule,
    GraphQLModule.forRoot({
      debug: true,
      playground: true,
      autoSchemaFile: path.join(__dirname, './schema.gql'),
    }),
  ],
})
export class App {}
