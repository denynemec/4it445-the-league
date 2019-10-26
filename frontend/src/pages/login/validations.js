export const validateLoginForm = ({
  email,
  setEmailError,
  password,
  setPasswordError,
  t,
}) => {
  if (isUndefinedOrEmptyString(email)) {
    setEmailError(t('Page.Login.Validations.EmailRequired'));
  }

  if (isUndefinedOrEmptyString(password)) {
    setPasswordError(t('Page.Login.Validations.PasswordRequired'));
  }
};

const isUndefinedOrEmptyString = value =>
  value === '' || typeof value === 'undefined';

export const isLoginFormValid = ({ email, password }) =>
  !isUndefinedOrEmptyString(email) && !isUndefinedOrEmptyString(password);
