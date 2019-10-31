export default {
  empty: () => '/',
  login: () => '/login',
  registration: () => '/registration',
  activateUser: () => '/activate-user/:userHash',
  resetPassword: () => '/reset-password',
  home: () => '/home',
  settings: () => '/settings',
  eventDetail: () => '/event/:eventId',
  lobbyDetail: () => '/lobby/:lobbyId',
  getEventDetail: id => `/event/${id}`,
  getLobbyDetail: id => `/lobby/${id}`,
};
