import Datastore from 'nedb-promises';
import path from 'path';
import chalk from 'chalk';
import isEqual from 'lodash/isEqual';

let failDataStore = Datastore.create(
  path.join(__dirname, '../../db/failDb.db')
);

export async function insertFail(value) {
  try {
    await failDataStore.insert(value);
  } catch (e) {
    console.log(chalk.redBright('入库失败', value));
  }
}

export async function findOneFail(value) {
  try {
    return await failDataStore.findOne({ adcode: value.adcode });
  } catch (e) {
    console.log(chalk.redBright('查库失败', value));
    return null;
  }
}

export async function updateFail(dbData, value) {
  try {
    console.log(value, 'update');
    const res = await failDataStore.update(
      { adcode: dbData.adcode },
      { $set: value },
      {}
    );
    console.log('update返回内容', res);
  } catch (e) {
    console.log(chalk.redBright('入库失败', value));
  }
}

export async function handleDbError(value) {
  try {
    const res: any = await findOneFail(value);
    if (res) {
      delete res._id;

      const is = isEqual(res, value);
      if (!is) {
        updateFail(res, value);
      }
    } else {
      await insertFail(value);
    }
  } catch (e) {
    console.log(chalk.redBright('处理入库失败', value));
  }
}
