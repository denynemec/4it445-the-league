import React from 'react';
import classNames from 'classnames';

export const Button = ({
  children,
  className,
  disabled,
  primary,
  secondary,
  submit,
  unstyled,
  ...rest
}) => (
  <button
    type={submit ? 'submit' : 'button'}
    className={classNames(
      { [baseButtonStyles]: !unstyled },
      { [disabledColorClasses]: disabled },
      {
        [primaryColorClasses]: primary && !disabled,
        [secondaryColorClasses]: secondary && !disabled,
      },
      className,
    )}
    disabled={disabled}
    {...rest}
  >
    {children}
  </button>
);

const baseButtonStyles = 'dib bg-animate pv2 ph4 br-pill bn shadow-1 pointer';

const primaryColorClasses =
  'white bg-dodger-blue hover-dodger-blue hover-bg-white';

const secondaryColorClasses =
  'spring-green bg-white hover-white hover-bg-spring-green';

const disabledColorClasses = 'black bg-moon-gray';
