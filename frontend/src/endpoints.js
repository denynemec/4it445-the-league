const apiPrefix = '/api';

export default {
  login: () => `${apiPrefix}/auth/login`,
  registration: () => `${apiPrefix}/auth/register-user`,
  activateUser: () => `${apiPrefix}/auth/activate-user`,
  newLobby: () => `${apiPrefix}/lobby/newLobby`,
  getEventList: () => `${apiPrefix}/event/list`,
  getLobbyList: () => `${apiPrefix}/lobby/list`,
  getSettings: () => `${apiPrefix}/settings/settings`,
  updateSettings: () => `${apiPrefix}/settings/update-settings`,
  updatePassword: () => `${apiPrefix}/settings/update-password`,
  getEventDetail: id => `${apiPrefix}/event/${id}`,
  getLobbyDetail: id => `${apiPrefix}/lobby/${id}`,
  resetPassword: () => `${apiPrefix}/auth/reset-password`,
  getJoinToLobbyDetail: lobbyHash =>
    `${apiPrefix}/lobby/join-to-lobby-detail/${lobbyHash}`,
  joinToLobby: () => `${apiPrefix}/lobby/join-to-lobby`,
};
