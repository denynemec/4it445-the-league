import React, { useEffect } from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

import { Layout, Button, Heading } from '../atoms';

export const Modal = ({
  isOpen,
  onConfirmClick,
  onCloseClick,
  headerLabel,
  confirmButtonLabel,
  children,
  withFooter,
  modalWidth = 'w-60',
  isDisabled,
}) => {
  const { t } = useTranslation();

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
  }, [isOpen]);

  return isOpen ? (
    <Layout
      top-0
      left-0
      z-index-100
      z-999
      fixed
      w-100
      h-100
      db
      flex
      flex-center
      justify-center
      bg-black-70
      border-box
    >
      <div
        className={classNames(
          'bg-white br3 ba mt6 flex flex-column fixed',
          modalWidth,
        )}
      >
        <Layout relative flex justify-between bb pa3>
          <Heading size="md">{headerLabel}</Heading>

          <Button
            unstyled
            className={classNames('bn bg-transparent b pointer')}
            onClick={onCloseClick}
            disabled={isDisabled}
          >
            X
          </Button>
        </Layout>

        <Layout relative pa3 border-box>
          {children}
        </Layout>

        {withFooter && (
          <Layout flex relative align-center justify-end pa3 bt>
            <Button primary onClick={onConfirmClick} isDisabled={isDisabled}>
              {confirmButtonLabel ||
                t('Organisms.Modal.DefaultConfirmButtonLabel')}
            </Button>
          </Layout>
        )}
      </div>
    </Layout>
  ) : null;
};
