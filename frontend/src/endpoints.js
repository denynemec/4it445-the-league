const apiPrefix = '/api';

export default {
  login: () => `${apiPrefix}/auth/login`,
  newLobby: () => `${apiPrefix}/newLobby`,
};
