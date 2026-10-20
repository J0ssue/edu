import { rm } from 'fs/promises';
import { join } from 'path';
import { beforeEach } from 'vitest';

beforeEach(async () => {
  try {
    await rm(join(__dirname, 'test.sqlite'), { force: true });
  } catch (err) {}
});
