import React from 'react';
import clsx from 'clsx';
import withStyles from '../styles/withStyles';
import FormControlContext from './FormControlContext';
import { isFilled, isAdornedStart } from '../InputBase/utils';
import isMuiElement from '../utils/isMuiElement';
import { StandardProps } from '..';

export type FormControlClassKey = 'root' | 'fullWidth';

export interface FormControlProps
  extends StandardProps<React.HTMLAttributes<HTMLDivElement>, FormControlClassKey> {
  disabled?: boolean;
  error?: boolean;
  focused?: boolean;
  required?: boolean;
  fullWidth?: boolean;
  variant?: 'default' | 'outlined';
  size?: 'small' | 'medium' | 'large';
  component?: React.ElementType;
}

const FormControl = React.forwardRef<HTMLDivElement, FormControlProps>(function FormControl(
  props,
  ref
) {
  const {
    children,
    className,
    error = false,
    disabled = false,
    required = false,
    fullWidth = false,
    focused: visuallyFocused,
    component: Component = 'div',
    classes,
    size,
    variant,
    ...other
  } = props;

  const [_focused, setFocused] = React.useState(false);
  const focused = visuallyFocused !== undefined ? visuallyFocused : _focused;

  if (disabled && focused) {
    setFocused(false);
  }

  const [filled, setFilled] = React.useState(() => {
    // We need to iterate through the children and find the Input in order
    // to fully support server-side rendering.
    let initialFilled = false;

    if (children) {
      React.Children.forEach(children, child => {
        if (!isMuiElement(child, ['Input', 'Select'])) {
          return;
        }

        if (isFilled(child.props, true)) {
          initialFilled = true;
        }
      });
    }

    return initialFilled;
  });

  const onFilled = React.useCallback(() => {
    setFilled(true);
  }, []);

  const onEmpty = React.useCallback(() => {
    setFilled(false);
  }, []);

  const childContext = {
    size,
    error,
    filled,
    variant,
    focused,
    required,
    disabled,
    fullWidth,
    onBlur: () => {
      setFocused(false);
    },
    onFocus: () => {
      setFocused(true);
    },
    onEmpty,
    onFilled,
  };

  return (
    <FormControlContext.Provider value={childContext}>
      <Component
        className={clsx(
          classes.root,
          {
            [classes.fullWidth]: fullWidth,
          },
          className
        )}
        ref={ref}
        {...other}
      >
        {children}
      </Component>
    </FormControlContext.Provider>
  );
});

export default withStyles(
  {
    /* Styles applied to the root element. */
    root: {
      display: 'inline-flex',
      flexDirection: 'column',
      position: 'relative',
      // Reset fieldset default style.
      minWidth: 0,
      padding: 0,
      margin: 0,
      border: 0,
      verticalAlign: 'top', // Fix alignment issue on Safari.
    },
    /* Styles applied to the root element if `fullWidth={true}`. */
    fullWidth: {
      width: '100%',
    },
  },
  { name: 'SuiFormControl' }
)(FormControl);
