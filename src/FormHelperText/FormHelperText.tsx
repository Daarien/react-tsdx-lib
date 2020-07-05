import React from 'react';
import clsx from 'clsx';
import styled from '@material-ui/core/styles/styled';
import formControlState from '../FormControl/formControlState';
import useFormControl from '../FormControl/useFormControl';

export interface FormHelperTextProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
  disabled?: boolean;
  error?: boolean;
  focused?: boolean;
  required?: boolean;
}

function FormHelperText(props: FormHelperTextProps) {
  const { children, className, disabled, error, focused, required, ...other } = props;

  const formControl = useFormControl();
  const fcs = formControlState({
    props,
    formControl,
    states: ['size', 'variant', 'disabled', 'error', 'focused', 'required'],
  });

  return (
    <p
      className={clsx(
        {
          large: fcs.size === 'large',
          focused: fcs.focused,
          disabled: fcs.disabled,
          required: fcs.required,
          error: fcs.error,
        },
        className
      )}
      {...other}
    >
      {children}
    </p>
  );
}

export default styled(FormHelperText)(({ theme }) => ({
  color: theme.palette.text.secondary,
  textAlign: 'left',
  marginTop: 4,
  fontSize: '0.75rem',
  lineHeight: '1rem',
  '&.large': {
    fontSize: '0.875rem',
    lineHeight: '1.25rem',
  },
  '&.disabled': {
    color: theme.palette.text.disabled,
  },
  '&.error': {
    color: theme.palette.error.main,
  },
}));
