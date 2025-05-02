import { MikroORM } from '@mikro-orm/core';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';
import { MySqlDriver } from '@mikro-orm/mysql';

export const orm = await MikroORM.init({
  entities: ['dist/**/*.entity.js'],
  entitiesTs: ['src/**/*.entity.ts'],
  dbName: 'sgidb',
  driver: MySqlDriver,
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'admin',
  clientUrl: 'mysql://root:root@localhost:3306/sgidb',
  highlighter: new SqlHighlighter(),
  debug: ['query', 'schema'],

  schemaGenerator: {
    //never in production
    disableForeignKeys: true,
    createForeignKeyConstraints: true,
    ignoreSchema: [],
  },
});

export const syncSchema = async () => {
  const generator = orm.getSchemaGenerator();
  /*   
  await generator.dropSchema()
  await generator.createSchema()
  */
  await generator.updateSchema();
};
