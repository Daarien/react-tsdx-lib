import React from 'react';
import clsx from 'clsx';
import withStyles from '../styles/withStyles';
import formControlState from '../FormControl/formControlState';
import useFormControl from '../FormControl/useFormControl';
import { FormControlState } from '../FormControl/FormControlContext';
import { StandardProps } from '..';

export type FormLabelClassKey =
  | 'root'
  | 'colorSecondary'
  | 'focused'
  | 'disabled'
  | 'error'
  | 'required'
  | 'asterisk';

export type FormLabelBaseProps = React.LabelHTMLAttributes<HTMLLabelElement>;

export interface FormLabelProps extends StandardProps<FormLabelBaseProps, FormLabelClassKey> {
  disabled?: boolean;
  error?: boolean;
  focused?: boolean;
  required?: boolean;
  component?: React.ElementType;
}

const FormLabel = React.forwardRef(function FormLabel(props: FormLabelProps, ref) {
  const {
    children,
    className,
    classes,
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
        classes.root,
        {
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
      {fcs.required && (
        <span
          aria-hidden
          className={clsx(classes.asterisk, {
            [classes.error]: fcs.error,
          })}
        >
          &thinsp;{'*'}
        </span>
      )}
    </Component>
  );
});

export default withStyles(
  theme => ({
    /* Styles applied to the root element. */
    root: {
      color: theme.palette.text.secondary,
      ...theme.typography.body1,
      lineHeight: 1,
      padding: 0,
      '&$focused': {
        color: theme.palette.primary.main,
      },
      '&$disabled': {
        color: theme.palette.text.disabled,
      },
      '&$error': {
        color: theme.palette.error.main,
      },
    },
    /* Styles applied to the root element if the color is secondary. */
    colorSecondary: {
      '&$focused': {
        color: theme.palette.secondary.main,
      },
    },
    /* Pseudo-class applied to the root element if `focused={true}`. */
    focused: {},
    /* Pseudo-class applied to the root element if `disabled={true}`. */
    disabled: {},
    /* Pseudo-class applied to the root element if `error={true}`. */
    error: {},
    /* Pseudo-class applied to the root element if `required={true}`. */
    required: {},
    /* Styles applied to the asterisk element. */
    asterisk: {
      '&$error': {
        color: theme.palette.error.main,
      },
    },
  }),
  { name: 'SuiFormLabel' }
)(FormLabel);
