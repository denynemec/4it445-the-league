import * as yup from 'yup';

import { emailsStringToEmailArray } from './';

export const translatedValidations = t => ({
  email: email(t),
  requiredString: requiredString(t),
  requiredEmail: requiredEmail(t),
  passwordsDontMatch: passwordsDontMatch(t),
  object: obj => yup.object().shape(obj),
  uniqueMinMaxEmails: uniqueMinMaxEmails(t),
  selectRequired: selectRequired(t),
  fileRequired: fileRequired(t),
});

const string = () => yup.string();

const number = () => yup.number();

const requiredString = t => string(t).required(t('Validations.Required'));

const email = t => string(t).email(t('Validations.Email'));

const requiredEmail = t => requiredString(t).email(t('Validations.Email'));

const passwordsDontMatch = t => passwordFieldName =>
  requiredString(t).oneOf(
    [yup.ref(passwordFieldName)],
    t('Validations.PasswordsDontMatch'),
  );

const uniqueMinMaxEmails = t => ({ min, max }) =>
  requiredString(t).test('uniqueMinMaxEmails', '', function(emails = '') {
    const { path, createError } = this;

    const rawEmails = emailsStringToEmailArray(emails);

    const emailsSet = new Set(rawEmails);

    if (
      rawEmails
        .map(email_ => email(t).isValidSync(email_))
        .filter(booleanValue => !booleanValue).length !== 0
    ) {
      return createError({
        path,
        message: t('Validations.EmailsContainNotEmail'),
      });
    }

    if (rawEmails.length !== emailsSet.size) {
      return createError({
        path,
        message: t('Validations.EmailsUnique'),
      });
    }

    if (rawEmails.length < min || rawEmails.length > max) {
      return createError({
        path,
        message: t('Validations.EmailsMinMax', { min, max }),
      });
    }

    return true;
  });

const selectRequired = t => number().min(0, t('Validations.SelectRequired'));

const mixed = () => yup.mixed();

const fileRequired = t => mixed().required(t('Validations.FileRequired'));
