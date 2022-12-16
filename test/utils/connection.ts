import { initDatasource } from '../../src/vendors/base/base.transation';

const connection = {
  async create() {
    return await initDatasource();
  },

  async clearAndClose() {
    const dataSource = await connection.create();
    const entities = dataSource.entityMetadatas;
    // empty table credit_admin_tokens first CAUSE relation index
    await dataSource.manager.query(`DELETE FROM credit_admin_tokens`);
    for (const entity of entities) {
      await dataSource.manager.query(`DELETE FROM ${entity.tableName}`);
    }
    await dataSource.destroy();
  },
};
export default connection;
