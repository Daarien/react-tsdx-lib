import React, { ComponentPropsWithRef } from 'react';
import clsx from 'clsx';
import withStyles from '../styles/withStyles';
import ListItem, { ListItemProps } from '../ListItem';
import { StandardProps } from '..';

export interface MenuItemProps
  extends StandardProps<ListItemProps, MenuItemClassKey>,
    ComponentPropsWithRef<'li'> {
  ListItemClasses?: ListItemProps['classes'];
}

const MenuItem = React.forwardRef<HTMLLIElement, MenuItemProps>(function MenuItem(props, ref) {
  const {
    classes,
    className,
    disableGutters = false,
    ListItemClasses,
    role = 'menuitem',
    selected,
    tabIndex: tabIndexProp,
    ...other
  } = props;

  let tabIndex;
  if (!props.disabled) {
    tabIndex = tabIndexProp !== undefined ? tabIndexProp : -1;
  }

  return (
    <ListItem
      button
      role={role}
      tabIndex={tabIndex}
      selected={selected}
      disableGutters={disableGutters}
      classes={ListItemClasses}
      className={clsx(
        classes.root,
        {
          [classes.selected]: selected,
          [classes.gutters]: !disableGutters,
        },
        className
      )}
      ref={ref}
      {...other}
    />
  );
});

export type MenuItemClassKey = 'root' | 'gutters' | 'selected';

export default withStyles(
  theme => ({
    /* Styles applied to the root element. */
    root: {
      ...theme.typography.body1,
      minHeight: 48,
      paddingTop: 6,
      paddingBottom: 6,
      boxSizing: 'border-box',
      width: 'auto',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      [theme.breakpoints.up('sm')]: {
        minHeight: 'auto',
      },
    },
    // TODO v5: remove
    /* Styles applied to the root element if `disableGutters={false}`. */
    gutters: {},
    /* Styles applied to the root element if `selected={true}`. */
    selected: {},
  }),
  { name: 'MuiMenuItem' }
)(MenuItem);
