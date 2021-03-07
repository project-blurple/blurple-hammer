const database = require("quick-store");

module.exports = {};

for (const db of [
  "strips", "oauth", "subserveraccessoverrides", "timezones"
]) {
  const qsdb = database(`${__dirname}/${db}.json`);
  module.exports[db] = {
    get: (key = null) => new Promise(resolve => key ? qsdb.getItem(key, resolve) : qsdb.get(resolve)),
    set: (key, value) => new Promise(resolve => qsdb.setItem(key, value, resolve)),
    setMultiple: (changes) => new Promise(resolve => qsdb.put(changes, resolve)),
    unset: (key) => new Promise(resolve => qsdb.removeItem(key, resolve))
  };
}