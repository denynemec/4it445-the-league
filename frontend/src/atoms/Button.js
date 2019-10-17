import React from 'react';
import classNames from 'classnames';

const baseButtonStyles = 'dib bg-animate pv2 ph4 br-pill bn';

const primaryColorClasses = 'white bg-green hover-bg-dark-green';
const secondaryColorClasses = 'white bg-red hover-bg-dark-red';
const disabledColorClasses = 'black bg-moon-gray';

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
