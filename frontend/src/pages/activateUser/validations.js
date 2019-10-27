export const validateActivateUserForm = ({ nickname, setNicknameError, t }) => {
  if (isUndefinedOrEmptyString(nickname)) {
    setNicknameError(t('Page.ActivateUser.Validations.NicknameRequired'));
  }
};

const isUndefinedOrEmptyString = value =>
  value === '' || typeof value === 'undefined';

export const isActivateUserFormValid = ({ nickname }) =>
  !isUndefinedOrEmptyString(nickname);
