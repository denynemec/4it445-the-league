const apiPrefix = '/api';

export default {
  login: () => `${apiPrefix}/auth/login`,
  activateUser: () => `${apiPrefix}/auth/activate-user`,
  newLobby: () => `${apiPrefix}/lobby/newLobby`,
  getEventList: () => `${apiPrefix}/event/list`,
  getLobbyList: () => `${apiPrefix}/lobby/list`,
};
