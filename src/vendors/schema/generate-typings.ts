import { GraphQLDefinitionsFactory } from '@nestjs/graphql';
import { join } from 'path';

// tslint:disable

const definitionsFactory = new GraphQLDefinitionsFactory();

definitionsFactory
  .generate({
    typePaths: ['./src/**/*.graphql'],
    path: join(process.cwd(), 'src/app/graphql/graphql.schema.ts'),
    outputAs: 'class',
    watch: false,
  })
  .catch((err) => {
    throw err;
  });
