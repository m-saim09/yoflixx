const fs = require('fs').promises;
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'demo-data');

const ensureDataDir = async () => {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (err) {
    // ignore
  }
};

const readJsonFile = async (filename) => {
  await ensureDataDir();
  const full = path.join(DATA_DIR, filename);
  try {
    const raw = await fs.readFile(full, 'utf8');
    return JSON.parse(raw || '[]');
  } catch (err) {
    if (err.code === 'ENOENT') {
      await writeJsonFile(filename, []);
      return [];
    }
    throw err;
  }
};

const writeJsonFile = async (filename, data) => {
  await ensureDataDir();
  const full = path.join(DATA_DIR, filename);
  const tmp = full + '.tmp';
  const body = JSON.stringify(data, null, 2);
  await fs.writeFile(tmp, body, 'utf8');
  await fs.rename(tmp, full);
};

module.exports = { DATA_DIR, readJsonFile, writeJsonFile, ensureDataDir };
