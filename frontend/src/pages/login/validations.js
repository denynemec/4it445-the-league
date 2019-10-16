export const validateLoginForm = ({
  username,
  setUsernameError,
  password,
  setPasswordError,
}) => {
  if (isUndefinedOrEmptyString(username)) {
    setUsernameError('Username is required');
  }

  if (isUndefinedOrEmptyString(password)) {
    setPasswordError('Password is required');
  }
};

const isUndefinedOrEmptyString = value =>
  value === '' || typeof value === 'undefined';

export const isLoginFormValid = ({ username, password }) =>
  !isUndefinedOrEmptyString(username) && !isUndefinedOrEmptyString(password);
