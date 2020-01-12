const apiPrefix = '/api';

const enumPrefix = `${apiPrefix}/enum`;

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
  fetchDraft: id => `${apiPrefix}/lobby/${id}/draft/fullState`,
  refrestDraftState: id => `${apiPrefix}/lobby/${id}/draft/state`,
  pickPlayer: id => `${apiPrefix}/lobby/${id}/draft/pickplayer`,
  startDraft: id => `${apiPrefix}/lobby/${id}/startDraft`,
  resetPassword: () => `${apiPrefix}/auth/reset-password`,
  getJoinToLobbyDetail: lobbyHash =>
    `${apiPrefix}/joinToLobby/join-to-lobby-detail/${lobbyHash}`,
  joinToLobby: () => `${apiPrefix}/joinToLobby/join-to-lobby`,
  resetPasswordConfirmation: () =>
    `${apiPrefix}/auth/reset-password-confirmation`,
  uploadPlayersToEvent: () =>
    `${apiPrefix}/administration/upload-players-to-event`,
  getNominationDetail: id => `${apiPrefix}/lobby/${id}/nomination/currentUser`,
  nominatePlayer: id => `${apiPrefix}/lobby/${id}/nomination/nominatePlayers`,
  removePlayerNomination: id =>
    `${apiPrefix}/lobby/${id}/nomination/removePlayerNomination`,

  // enums
  enumEvents: () => `${enumPrefix}/events`,
  enumLobbyPositions: lobbyId => `${enumPrefix}/positions/${lobbyId}`,
};
