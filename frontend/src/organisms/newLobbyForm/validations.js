export const validateNewLobbyForm = ({ lobbyName, setLobbyNameError, t }) => {
  if (isUndefinedOrEmptyString(lobbyName)) {
    setLobbyNameError(
      t('Organisms.NewLobbyForm.Validations.LobbyNameRequired'),
    );
  }
};

const isUndefinedOrEmptyString = value =>
  value === '' || typeof value === 'undefined';

export const isNewLobbyFormValid = ({ lobbyName }) =>
  !isUndefinedOrEmptyString(lobbyName);
