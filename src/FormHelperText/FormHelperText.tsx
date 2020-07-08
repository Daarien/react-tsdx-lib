import React from 'react';
import clsx from 'clsx';
import withStyles from '../styles/withStyles';
import formControlState from '../FormControl/formControlState';
import useFormControl from '../FormControl/useFormControl';
import { StandardProps } from '..';

export type FormHelperTextClassKey =
  | 'root'
  | 'error'
  | 'disabled'
  | 'marginDense'
  | 'large'
  | 'focused'
  | 'required';

export interface FormHelperTextProps
  extends StandardProps<React.HTMLAttributes<HTMLParagraphElement>, FormHelperTextClassKey> {
  /**
   * If `true`, the helper text should be displayed in a disabled state.
   */
  disabled?: boolean;
  /**
   * If `true`, helper text should be displayed in an error state.
   */
  error?: boolean;
  /**
   * If `true`, the helper text should use focused classes key.
   */
  focused?: boolean;
  /**
   * If `dense`, will adjust vertical spacing. This is normally obtained via context from
   * FormControl.
   */
  margin?: 'dense';
  /**
   * If `true`, the helper text should use required classes key.
   */
  required?: boolean;
  /**
   * The variant to use.
   */
  variant?: 'default' | 'outlined';
}

const FormHelperText = React.forwardRef<HTMLParagraphElement, FormHelperTextProps>(
  function FormHelperText(props, ref) {
    const {
      children,
      classes,
      className,
      disabled,
      error,
      focused,
      required,
      variant,
      ...other
    } = props;

    const formControl = useFormControl();
    const fcs = formControlState({
      props,
      formControl,
      states: ['size', 'variant', 'disabled', 'error', 'focused', 'required'],
    });

    return (
      <p
        className={clsx(
          classes.root,
          {
            [classes.large]: fcs.size === 'large',
            [classes.marginDense]: fcs.margin === 'dense',
            [classes.disabled]: fcs.disabled,
            [classes.error]: fcs.error,
            [classes.focused]: fcs.focused,
            [classes.required]: fcs.required,
          },
          className
        )}
        ref={ref}
        {...other}
      >
        {children}
      </p>
    );
  }
);

export default withStyles(
  theme => ({
    /* Styles applied to the root element. */
    root: {
      color: theme.palette.text.secondary,
      ...theme.typography.caption,
      textAlign: 'left',
      marginTop: 4,
      margin: 0,
      fontSize: '0.75rem',
      lineHeight: '1rem',
      '&$disabled': {
        color: theme.palette.text.disabled,
      },
      '&$error': {
        color: theme.palette.error.main,
      },
    },
    /* Pseudo-class applied to the root element if `error={true}`. */
    error: {},
    /* Pseudo-class applied to the root element if `disabled={true}`. */
    disabled: {},
    /* Styles applied to the root element if `margin="dense"`. */
    marginDense: {
      marginTop: 4,
    },
    /* Styles applied to the root element if `size="large"`. */
    large: {
      fontSize: '0.875rem',
      lineHeight: '1.25rem',
    },
    /* Pseudo-class applied to the root element if `focused={true}`. */
    focused: {},
    /* Pseudo-class applied to the root element if `filled={true}`. */
    filled: {},
    /* Pseudo-class applied to the root element if `required={true}`. */
    required: {},
  }),
  { name: 'SuiFormHelperText' }
)(FormHelperText);
