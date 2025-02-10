import { StorageManager } from '@vben-core/shared/cache';

const PREFIX_NAIVE = 'naive';

export const storageUtils = new StorageManager({
  prefix: PREFIX_NAIVE
})
