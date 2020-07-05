import React, { EventHandler, MouseEvent } from 'react';
import BaseButton, { ButtonBaseProps } from '../ButtonBase';
import { withStyles, Theme } from '@material-ui/core/styles';
import { StyleRules } from '@material-ui/styles/withStyles';
import clsx from 'clsx';

type TabClassKey = 'root' | 'selected' | 'fullWidth' | 'vertical';

export interface ButtonTabProps extends Omit<ButtonBaseProps, 'onChange' | 'classes'> {
  value: any;
  label: string;
  selected?: boolean;
  fullWidth?: boolean;
  classes: Record<TabClassKey, string>;
  tabsOrientation?: 'horizontal' | 'vertical';
  onChange?: (e: MouseEvent<HTMLButtonElement>, value: any) => void;
  onClick?: EventHandler<MouseEvent<HTMLButtonElement>>;
}

const ButtonTab = React.forwardRef<HTMLButtonElement, ButtonTabProps>(function ButtonTab(
  props,
  ref
) {
  const {
    className,
    value,
    label,
    selected,
    fullWidth,
    classes,
    tabsOrientation,
    onChange,
    onClick,
  } = props;

  function handleClick(e: MouseEvent<HTMLButtonElement>) {
    if (onChange) {
      onChange(e, value);
    }
    if (onClick) {
      onClick(e);
    }
  }

  return (
    <BaseButton
      ref={ref}
      className={clsx(
        classes.root,
        {
          [classes.selected]: selected,
          [classes.fullWidth]: fullWidth,
          [classes.vertical]: tabsOrientation === 'vertical',
        },
        className
      )}
      onClick={handleClick}
    >
      {label}
    </BaseButton>
  );
});

const styles = (theme: Theme): StyleRules => ({
  root: {
    maxWidth: 264,
    minWidth: 72,
    position: 'relative',
    boxSizing: 'border-box',
    minHeight: 48,
    flexShrink: 0,
    lineHeight: 1.5,
    color: '#6c6c6c',
    backgroundColor: 'white',
    // padding: theme.spacing(1.25, 2),
    overflow: 'hidden',
    whiteSpace: 'normal',
    marginRight: theme.spacing(1.5),
    borderRadius: theme.shape.borderRadius,
  },
  selected: {
    color: 'white',
    backgroundColor: '#222222',
    borderColor: '#222222',
  },
  vertical: {
    marginBottom: theme.spacing(1.5),
  },
  fullWidth: {
    flexShrink: 1,
    flexGrow: 1,
    flexBasis: 0,
    maxWidth: 'none',
  },
});

export default withStyles(styles, { name: 'SuiButtonTab' })(ButtonTab);
