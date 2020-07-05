import React, { forwardRef, cloneElement, isValidElement, ReactNode, ChangeEvent } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { isFragment } from 'react-is';
import clsx from 'clsx';

type TabsClassKey = 'root' | 'vertical' | 'centered';

export interface ButtonTabsProps {
  children: ReactNode;
  onChange: (e: ChangeEvent<unknown>, value: any) => void;
  classes: Record<TabsClassKey, string>;
  value?: any;
  className?: string;
  centered?: boolean;
  variant?: 'standart' | 'fullWidth';
  orientation?: 'horizontal' | 'vertical';
}

const ButtonTabs = forwardRef<HTMLDivElement, ButtonTabsProps>(function ButtonTabs(props, ref) {
  const {
    children: childrenProp,
    classes,
    className,
    value,
    centered = false,
    variant = 'standard',
    orientation = 'horizontal',
    onChange,
  } = props;

  let childIndex = 0;
  const children = React.Children.map(childrenProp, child => {
    if (!isValidElement(child)) {
      return null;
    }

    if (process.env.NODE_ENV !== 'production') {
      if (isFragment(child)) {
        console.error(
          [
            "SU-UI: The Tabs component doesn't accept a Fragment as a child.",
            'Consider providing an array instead.',
          ].join('\n')
        );
      }
    }

    const childValue = child.props.value === undefined ? childIndex : child.props.value;
    const selected = childValue === value;

    childIndex += 1;
    return cloneElement(child, {
      fullWidth: variant === 'fullWidth',
      tabsOrientation: orientation,
      value: childValue,
      selected,
      onChange,
    });
  });

  return (
    <div
      ref={ref}
      className={clsx(
        classes.root,
        { [classes.vertical]: orientation === 'vertical' },
        { [classes.centered]: centered },
        className
      )}
    >
      {children}
    </div>
  );
});

export default withStyles(
  {
    root: {
      display: 'flex',
      minHeight: 48,
      WebkitOverflowScrolling: 'touch', // Add iOS momentum scrolling.
    },
    vertical: {
      flexDirection: 'column',
    },
    centered: {
      justifyContent: 'center',
    },
  },
  { name: 'SuiButtonTabs' }
)(ButtonTabs);
