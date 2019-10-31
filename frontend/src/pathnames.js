export default {
  empty: () => '/',
  login: () => '/login',
  registration: () => '/registration',
  resetPassword: () => '/reset-password',
  home: () => '/home',
  settings: () => '/settings',
  groupDetail: () => '/groupdetail',
  LOBBY_DETAIL: id => `lobby/${id}`,
  EVENT_DETAIL: id => `event/${id}`,
};
