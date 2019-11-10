export default {
  empty: () => '/',
  login: () => '/login',
  registrationWithPrefilledEmail: () => `${registrationBase}/:email`,
  getRegistrationWithPrefilledEmail: prefilledEmail =>
    `${registrationBase}/${prefilledEmail}`,
  registration: () => registrationBase,
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
  getDraftDetail: id => `/lobby/${id}/draft`,
  administration: () => '/administration',
};

const registrationBase = '/registration';

const activateUserBase = '/activate-user';

const joinToLobbyBase = '/join-to-lobby';
