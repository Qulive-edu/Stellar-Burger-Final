import store, { rootReducer } from '../services/store';
import { expect } from '@jest/globals';

test('rootReducer инициализируется как в хранилище', () => {
  const unknown = rootReducer(undefined, { type: 'NOPE' });
  expect(unknown).toEqual(store.getState());
});
