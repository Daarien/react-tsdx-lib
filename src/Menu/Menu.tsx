import React, { MutableRefObject, ReactElement, ComponentPropsWithRef } from 'react';
import ReactDOM from 'react-dom';
import clsx from 'clsx';
import { isFragment } from 'react-is';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper, { PaperProps } from '@material-ui/core/Paper';
import Popper, { PopperProps } from '@material-ui/core/Popper';
import { MenuItemProps } from '../MenuItem';
import MenuList, { MenuListProps } from '@material-ui/core/MenuList';
import withStyles from '../styles/withStyles';
import { StandardProps } from '..';
import setRef from '../utils/setRef';

export type MenuClassKey = 'paper' | 'list';

export interface MenuProps extends StandardProps<PopperProps, MenuClassKey> {
  /**
   * A HTML element, or a function that returns it.
   * It's used to set the position of the menu.
   * @document
   */
  anchorEl?: PopperProps['anchorEl'];
  /**
   * If `true` (Default) will focus the `[role="menu"]` if no focusable child is found. Disabled
   * children are not focusable. If you set this prop to `false` focus will be placed
   * on the parent modal container. This has severe accessibility implications
   * and should only be considered if you manage focus otherwise.
   */
  autoFocus?: boolean;
  /**
   * Menu contents, normally `MenuItem`s.
   */
  children: React.ReactNode;
  /**
   * When opening the menu will not focus the active item but the `[role="menu"]`
   * unless `autoFocus` is also set to `false`. Not using the default means not
   * following WAI-ARIA authoring practices. Please be considerate about possible
   * accessibility implications.
   */
  disableAutoFocusItem?: boolean;
  MenuListProps?: Partial<MenuListProps>;
  PaperProps?: Partial<PaperProps>;
  /**
   * If `true`, the menu is visible.
   */
  open: boolean;
  onClose?: (event: React.KeyboardEvent<HTMLUListElement | Document>) => void;
}

const Menu = React.forwardRef<HTMLDivElement, MenuProps>(function Menu(props, ref) {
  const {
    autoFocus = true,
    children,
    classes,
    disableAutoFocusItem = false,
    MenuListProps = {},
    open,
    onClose,
    PaperProps = {},
    ...other
  } = props;

  const anchorRef: MutableRefObject<Element | null> = React.useRef<Element>(null);

  const autoFocusItem = autoFocus && !disableAutoFocusItem && open;

  function handleListKeyDown(event: React.KeyboardEvent<HTMLUListElement>) {
    if (event.key === 'Tab') {
      event.preventDefault();

      if (onClose) {
        onClose(event);
      }
    }
  }

  function handleClose(event) {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    if (onClose) {
      onClose(event);
    }
  }

  /**
   * the index of the item should receive focus
   * in a `variant="selectedMenu"` it's the first `selected` item
   * otherwise it's the very first item.
   */
  let activeItemIndex = -1;
  // since we inject focus related props into children we have to do a lookahead
  // to check if there is a `selected` item. We're looking for the last `selected`
  // item and use the first valid item as a fallback
  React.Children.map(children, (child, index) => {
    // console.log('Menu -> child', child);
    if (!React.isValidElement(child)) {
      return;
    }

    if (process.env.NODE_ENV !== 'production') {
      if (isFragment(child)) {
        console.error(
          [
            "SU-UI: The Menu component doesn't accept a Fragment as a child.",
            'Consider providing an array instead.',
          ].join('\n')
        );
      }
    }

    if (!child.props.disabled) {
      if (activeItemIndex === -1) {
        activeItemIndex = index;
      }
    }
  });

  const items = React.Children.map(
    children as ReactElement<MenuItemProps, 'li'>,
    (child, index) => {
      if (index === activeItemIndex) {
        return React.cloneElement(child, {
          ref: instance => {
            anchorRef.current = ReactDOM.findDOMNode(instance) as Element;
            setRef(child.props.ref, instance!);
          },
        } as Partial<MenuItemProps>);
      }

      return child;
    }
  );

  return (
    <Popper open={open} role="menu" transition disablePortal ref={ref} {...other}>
      {({ TransitionProps, placement }) => (
        <Grow
          {...TransitionProps}
          style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
        >
          <Paper>
            <ClickAwayListener mouseEvent="onMouseDown" onClickAway={handleClose}>
              <MenuList
                autoFocusItem={autoFocusItem}
                onKeyDown={handleListKeyDown}
                {...MenuListProps}
                className={clsx(classes.list, MenuListProps.className)}
              >
                {items}
              </MenuList>
            </ClickAwayListener>
          </Paper>
        </Grow>
      )}
    </Popper>
  );
});

export default withStyles(
  () => ({
    paper: {},
    list: {},
  }),
  { name: 'SuiMenu' }
)(Menu);
