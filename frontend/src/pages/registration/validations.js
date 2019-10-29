export const validateRegistrationForm = ({
  email,
  setEmailError,
  password,
  passwordConfirmation,
  setPasswordError,
  setPasswordConfirmationError,
  t,
}) => {
  if (isUndefinedOrEmptyString(email)) {
    setEmailError(t('Page.Registration.Validations.EmailRequired'));
  }

  if (isUndefinedOrEmptyString(password)) {
    setPasswordError(t('Page.Registration.Validations.PasswordRequired'));
  }

  if (isUndefinedOrEmptyString(passwordConfirmation)) {
    setPasswordConfirmationError(
      t('Page.Registration.Validations.passwordConfirmationRequired'),
    );
  }

  if (passwordConfirmation != password) {
    setPasswordConfirmationError(
      t('Page.Registration.Validations.passwordConfirmationNotvalid'),
    );
  }
};

const isUndefinedOrEmptyString = value =>
  value === '' || typeof value === 'undefined';

export const isRegistrationFormValid = ({
  email,
  password,
  passwordConfirmation,
}) =>
  !isUndefinedOrEmptyString(email) &&
  !isUndefinedOrEmptyString(password) &&
  !isUndefinedOrEmptyString(passwordConfirmation);
