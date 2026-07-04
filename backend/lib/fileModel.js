const { readJsonFile, writeJsonFile } = require('./fileStorage');
const crypto = require('crypto');

const makeId = () => crypto.randomBytes(8).toString('hex');

const matchesValue = (value, queryValue) => {
  if (queryValue && typeof queryValue === 'object' && !Array.isArray(queryValue)) {
    if (queryValue.$regex) {
      const regex = new RegExp(queryValue.$regex, queryValue.$options || '');
      return typeof value === 'string' && regex.test(value);
    }

    if (queryValue.$gte !== undefined) {
      return value >= queryValue.$gte;
    }
    if (queryValue.$gt !== undefined) {
      return value > queryValue.$gt;
    }
    if (queryValue.$lte !== undefined) {
      return value <= queryValue.$lte;
    }
    if (queryValue.$lt !== undefined) {
      return value < queryValue.$lt;
    }
  }

  return value === queryValue;
};

const matchFilter = (item, filter = {}) => {
  const keys = Object.keys(filter || {});
  for (const key of keys) {
    const val = filter[key];
    if (key === '$or' && Array.isArray(val)) {
      if (!val.some((cond) => matchFilter(item, cond))) return false;
      continue;
    }

    if (item[key] === undefined) return false;
    if (!matchesValue(item[key], val)) return false;
  }
  return true;
};

const createQuery = (loader) => {
  let results = [];
  let sortSpec = null;
  let skipValue = 0;
  let limitValue = null;
  let applied = false;
  const obj = {
    sort(sortObj) {
      sortSpec = sortObj || null;
      return obj;
    },
    skip(n) {
      skipValue = Number(n) || 0;
      return obj;
    },
    limit(n) {
      limitValue = Number(n) || null;
      return obj;
    },
    async exec() {
      if (!applied) {
        const items = await loader();
        results = items.filter(Boolean);
        if (sortSpec) {
          const [[key, dir]] = Object.entries(sortSpec);
          results.sort((a, b) => {
            if (a[key] === b[key]) return 0;
            return (a[key] > b[key] ? 1 : -1) * (dir === -1 ? -1 : 1);
          });
        }
        results = results.slice(skipValue);
        if (limitValue !== null) {
          results = results.slice(0, limitValue);
        }
        applied = true;
      }
      return results;
    },
    then(resolve, reject) {
      return obj.exec().then(resolve, reject);
    },
    catch(reject) {
      return obj.exec().catch(reject);
    },
  };

  return obj;
};

const createFileModel = (filename) => {
  const file = filename;
  const model = {
    async _readAll() {
      const arr = await readJsonFile(file);
      return Array.isArray(arr) ? arr : [];
    },
    async _writeAll(items) {
      await writeJsonFile(file, items);
    },
    find(filter = {}) {
      return createQuery(async () => {
        const items = await model._readAll();
        return items.filter((it) => matchFilter(it, filter));
      });
    },
    findOne(filter = {}) {
      const promise = (async () => {
        const items = await model._readAll();
        const found = items.find((it) => matchFilter(it, filter)) || null;
        if (!found) return null;
        return modelInstance(model, found);
      })();

      return {
        select() {
          return this;
        },
        then(resolve, reject) {
          return promise.then(resolve, reject);
        },
        catch(reject) {
          return promise.catch(reject);
        },
      };
    },
    async countDocuments(filter = {}) {
      const items = await model._readAll();
      return items.filter((it) => matchFilter(it, filter)).length;
    },
    async deleteMany(filter = {}) {
      const items = await model._readAll();
      const remaining = items.filter((it) => !matchFilter(it, filter));
      await model._writeAll(remaining);
      return { deletedCount: items.length - remaining.length };
    },
    async insertMany(docs = []) {
      const items = await model._readAll();
      const now = new Date().toISOString();
      const inserted = docs.map((doc) => {
        const next = { ...doc, _id: doc._id || makeId(), createdAt: doc.createdAt || now, updatedAt: now };
        items.push(next);
        return modelInstance(model, next);
      });
      await model._writeAll(items);
      return inserted;
    },
    async create(doc) {
      const items = await model._readAll();
      const now = new Date().toISOString();
      const next = { ...doc, _id: doc._id || makeId(), createdAt: doc.createdAt || now, updatedAt: now };
      items.push(next);
      await model._writeAll(items);
      return modelInstance(model, next);
    },
    async findById(id) {
      const items = await model._readAll();
      const found = items.find((it) => String(it._id) === String(id));
      return found ? modelInstance(model, found) : null;
    },
    async findByIdAndUpdate(id, updates, options = {}) {
      const items = await model._readAll();
      const idx = items.findIndex((it) => String(it._id) === String(id));
      if (idx === -1) return null;
      const merged = { ...items[idx], ...updates, updatedAt: new Date().toISOString() };
      items[idx] = merged;
      await model._writeAll(items);
      return options.new ? modelInstance(model, merged) : modelInstance(model, items[idx]);
    },
    async findByIdAndDelete(id) {
      const items = await model._readAll();
      const idx = items.findIndex((it) => String(it._id) === String(id));
      if (idx === -1) return null;
      const removed = items.splice(idx, 1)[0];
      await model._writeAll(items);
      return modelInstance(model, removed);
    },
  };

  return model;
};

const modelInstance = (model, data) => {
  const doc = { ...data };
  // attach toObject for nested plain objects to mimic mongoose subdocs
  Object.keys(doc).forEach((k) => {
    const v = doc[k];
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      if (typeof v.toObject !== 'function') {
        v.toObject = function () {
          return { ...this };
        };
      }
    }
  });
  doc.save = async function () {
    const items = await model._readAll();
    const idx = items.findIndex((it) => String(it._id) === String(this._id));
    const now = new Date().toISOString();
    if (idx === -1) {
      this.createdAt = this.createdAt || now;
      this.updatedAt = now;
      items.push(this);
    } else {
      this.updatedAt = now;
      items[idx] = this;
    }
    await model._writeAll(items);
    return this;
  };
  doc.toObject = function () {
    const copy = { ...this };
    return copy;
  };
  return doc;
};

// make findOne return thenable with select
const wrapThenable = (promiseFactory) => {
  const q = {
    select() {
      return this;
    },
    then(resolve, reject) {
      return promiseFactory().then(resolve, reject);
    },
    catch(reject) {
      return promiseFactory().catch(reject);
    },
  };
  return q;
};

// override createFileModel to provide findOne as thenable wrapper
const _createFileModel = createFileModel;
const createFileModelWrapped = (filename) => {
  const model = _createFileModel(filename);
  return model;
};

module.exports = { createFileModel: createFileModelWrapped };

module.exports = { createFileModel };
