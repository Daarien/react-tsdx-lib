import React, { ElementType, ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';
import withStyles from '@material-ui/core/styles/withStyles';
import { StandardProps } from '..';

export type ButtonBaseClassKey = 'root' | 'disabled';

export interface ButtonBaseProps
  extends StandardProps<ButtonHTMLAttributes<HTMLButtonElement>, ButtonBaseClassKey> {
  component?: ElementType;
  href?: string;
}

const ButtonBase = React.forwardRef(function ButtonBase(props: ButtonBaseProps, ref) {
  const {
    children,
    classes,
    className,
    component = 'button',
    type = 'button',
    tabIndex = 0,
    disabled,
    ...other
  } = props;

  let Component = component;

  if (Component === 'button' && other.href) {
    Component = 'a';
  }

  const buttonProps = {} as ButtonHTMLAttributes<HTMLButtonElement>;
  if (Component === 'button') {
    buttonProps.type = type;
    buttonProps.disabled = disabled;
  } else {
    if (Component !== 'a' || !other.href) {
      buttonProps.role = 'button';
    }
    buttonProps['aria-disabled'] = disabled;
  }

  return (
    <Component
      className={clsx(
        classes.root,
        {
          [classes.disabled]: disabled,
        },
        className
      )}
      ref={ref}
      tabIndex={disabled ? -1 : tabIndex}
      {...buttonProps}
      {...other}
    >
      {children}
    </Component>
  );
});

export default withStyles(
  () => ({
    /* Styles applied to the root element. */
    root: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      WebkitTapHighlightColor: 'transparent',
      backgroundColor: 'transparent', // Reset default value
      // We disable the focus ring for mouse, touch and keyboard users.
      outline: 0,
      border: 0,
      margin: 0, // Remove the margin in Safari
      borderRadius: 0,
      padding: 0, // Remove the padding in Firefox
      cursor: 'pointer',
      userSelect: 'none',
      verticalAlign: 'middle',
      '-moz-appearance': 'none', // Reset
      '-webkit-appearance': 'none', // Reset
      textDecoration: 'none',
      // So we take precedent over the style of a native <a /> element.
      color: 'inherit',
      '&::-moz-focus-inner': {
        borderStyle: 'none', // Remove Firefox dotted outline.
      },
      '&$disabled': {
        pointerEvents: 'none', // Disable link interactions
        cursor: 'default',
      },
      '@media print': {
        colorAdjust: 'exact',
      },
    },
    /* Pseudo-class applied to the root element if `disabled={true}`. */
    disabled: {},
  }),
  { name: 'SuiButtonBase' }
)(ButtonBase);
