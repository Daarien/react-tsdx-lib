import React from 'react';
import { FormControlProps } from './FormControl';

type ContextFromPropsKey = 'error' | 'required' | 'disabled' | 'fullWidth' | 'variant' | 'size';

export interface FormControlState extends Pick<FormControlProps, ContextFromPropsKey> {
  filled: boolean;
  focused: boolean;
  onBlur: (event?: any) => void;
  onEmpty: () => void;
  onFilled: () => void;
  onFocus: (event?: any) => void;
}

const FormControlContext = React.createContext<FormControlState | undefined>(undefined);

if (process.env.NODE_ENV !== 'production') {
  FormControlContext.displayName = 'FormControlContext';
}

export default FormControlContext;
