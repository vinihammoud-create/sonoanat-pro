import '@testing-library/jest-dom/vitest';
import 'fake-indexeddb/auto';

// URL.createObjectURL não existe no jsdom.
if (typeof URL.createObjectURL !== 'function') {
  let n = 0;
  URL.createObjectURL = () => `blob:mock-${++n}`;
  URL.revokeObjectURL = () => undefined;
}
