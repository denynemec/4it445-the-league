export const validateLoginForm = ({
  username,
  setUsernameError,
  password,
  setPasswordError,
  t,
}) => {
  if (isUndefinedOrEmptyString(username)) {
    setUsernameError(t('Page.Login.Validations.UsernameRequired'));
  }

  if (isUndefinedOrEmptyString(password)) {
    setPasswordError(t('Page.Login.Validations.PasswordRequired'));
  }
};

const isUndefinedOrEmptyString = value =>
  value === '' || typeof value === 'undefined';

export const isLoginFormValid = ({ username, password }) =>
  !isUndefinedOrEmptyString(username) && !isUndefinedOrEmptyString(password);
