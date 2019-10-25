const apiPrefix = '/api';

export default {
  login: () => `${apiPrefix}/auth/login`,
  newLobby: () => `${apiPrefix}/lobby/newLobby`,
  getEventList: () => `${apiPrefix}/event/list`,
  getLobbyList: () => `${apiPrefix}/lobby/list`,
};
