import React from 'react';
import clsx from 'clsx';
import styled from '@material-ui/core/styles/styled';
import formControlState from '../FormControl/formControlState';
import useFormControl from '../FormControl/useFormControl';
import { FormControlState } from '../FormControl/FormControlContext';

export interface FormLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  disabled?: boolean;
  error?: boolean;
  focused?: boolean;
  required?: boolean;
  component?: React.ElementType;
}

function FormLabel(props: FormLabelProps) {
  const {
    children,
    className,
    disabled,
    error,
    focused,
    required,
    component: Component = 'label',
    ...other
  } = props;

  const formControl = useFormControl();
  const fcs = formControlState({
    props,
    formControl,
    states: ['required', 'focused', 'disabled', 'error'],
  }) as { [K in 'required' | 'focused' | 'disabled' | 'error']: FormControlState[K] };

  return (
    <Component
      className={clsx(
        { focused: fcs.focused, disabled: fcs.disabled, error: fcs.error },
        className
      )}
      {...other}
    >
      {children}
    </Component>
  );
}

export default styled(FormLabel)(({ theme }) => ({
  color: theme.palette.text.secondary,
  lineHeight: 1,
  padding: 0,
  '&.focused': {
    color: theme.palette.text.primary,
  },
  '&.disabled': {
    color: theme.palette.text.disabled,
  },
  '&.error': {
    color: theme.palette.error.main,
  },
}));
