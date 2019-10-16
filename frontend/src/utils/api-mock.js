import MockAdapter from 'axios-mock-adapter';
import { mocks } from './mocks';
import ENDPOINTS from '../endpoints';

const MOCK_API_DELAY = 500;

export function installApiMocks(api) {
  const mockAdapter = new MockAdapter(api, { delayResponse: MOCK_API_DELAY });

  // login
  mockAdapter.onPost(ENDPOINTS.login()).reply(200, {
    token: 'mock-token',
    user: mocks.users[0],
  });

  // all other
  mockAdapter.onAny().passThrough();
}
