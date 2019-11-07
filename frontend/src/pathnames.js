export default {
  empty: () => '/',
  login: () => '/login',
  registration: () => '/registration',
  activateUser: () => `${activateUserBase}/:userHash`,
  getActivateUser: () => activateUserBase,
  resetPassword: () => '/reset-password',
  resetPasswordConfirmation: () => '/reset-password-confirmation/:userHash',
  getResetPasswordConfirmation: () => '/reset-password-confirmation',
  home: () => '/home',
  settings: () => '/settings',
  eventDetail: () => '/event/:eventId',
  lobbyDetail: () => '/lobby/:lobbyId',
  getEventDetail: id => `/event/${id}`,
  getLobbyDetail: id => `/lobby/${id}`,
  joinToLobby: () => `${joinToLobbyBase}/:lobbyHash`,
  getJoinToLobby: () => joinToLobbyBase,
  draftDetail: () => '/lobby/:lobbyId/draft',
};

const activateUserBase = '/activate-user';

const joinToLobbyBase = '/join-to-lobby';
