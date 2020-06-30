import React from 'react';
import { css } from 'astroturf';
import ButtonBase, { ButtonBaseProps } from '../ButtonBase';

export interface ButtonProps extends ButtonBaseProps {
  variant?: 'contained' | 'outlined';
}

function Button(props: ButtonProps) {
  const { children, variant, ...other } = props;
  return (
    <ButtonBase className={classes.astroButton} {...other}>
      {children}
    </ButtonBase>
  );
}

const color = 'forestgreen';

const classes = css`
  .astroButton {
    color: white;
    background-color: ${color};
    border: 1px solid ${color};
    border-radius: 4px;
    min-width: 64px;
    padding: 8px 16px;
    user-select: none;
    outline: none;
  }
`;

export default Button;
