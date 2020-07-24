import React, { KeyboardEvent, MutableRefObject, ReactElement } from 'react';
import ReactDOM from 'react-dom';
import { isFragment } from 'react-is';
import ownerDocument from '@material-ui/core/utils/ownerDocument';
import List from '../List';
import getScrollbarSize from '@material-ui/core/utils/getScrollbarSize';
import useForkRef from '../utils/useForkRef';
import { Classes } from '../styles';
import { ListProps, ListClassKey } from '../List';
import { MenuItemProps } from '../MenuItem';
import { OverridableProps } from '..';

export type MenuListClassKey = ListClassKey;

export interface MenuListProps extends Omit<ListProps, 'classes'> {
  classes?: Classes<MenuListClassKey>;
  autoFocus?: boolean;
  autoFocusItem?: boolean;
  disabledItemsFocusable?: boolean;
  disableListWrap?: boolean;
  variant?: 'menu' | 'selectedMenu';
}

function nextItem(list, item, disableListWrap) {
  if (list === item) {
    return list.firstChild;
  }
  if (item && item.nextElementSibling) {
    return item.nextElementSibling;
  }
  return disableListWrap ? null : list.firstChild;
}

function previousItem(list, item, disableListWrap) {
  if (list === item) {
    return disableListWrap ? list.firstChild : list.lastChild;
  }
  if (item && item.previousElementSibling) {
    return item.previousElementSibling;
  }
  return disableListWrap ? null : list.lastChild;
}

function textCriteriaMatches(nextFocus, textCriteria) {
  if (textCriteria === undefined) {
    return true;
  }
  let text = nextFocus.innerText;
  if (text === undefined) {
    // jsdom doesn't support innerText
    text = nextFocus.textContent;
  }
  text = text.trim().toLowerCase();
  if (text.length === 0) {
    return false;
  }
  if (textCriteria.repeating) {
    return text[0] === textCriteria.keys[0];
  }
  return text.indexOf(textCriteria.keys.join('')) === 0;
}

function moveFocus(
  list,
  currentFocus,
  disableListWrap,
  disabledItemsFocusable,
  traversalFunction,
  textCriteria?
) {
  let wrappedOnce = false;
  let nextFocus = traversalFunction(list, currentFocus, currentFocus ? disableListWrap : false);

  while (nextFocus) {
    // Prevent infinite loop.
    if (nextFocus === list.firstChild) {
      if (wrappedOnce) {
        return;
      }
      wrappedOnce = true;
    }

    // Same logic as useAutocomplete.js
    const nextFocusDisabled = disabledItemsFocusable
      ? false
      : nextFocus.disabled || nextFocus.getAttribute('aria-disabled') === 'true';

    if (
      !nextFocus.hasAttribute('tabindex') ||
      !textCriteriaMatches(nextFocus, textCriteria) ||
      nextFocusDisabled
    ) {
      // Move to the next element.
      nextFocus = traversalFunction(list, nextFocus, disableListWrap);
    } else {
      nextFocus.focus();
      return;
    }
  }
}

const useEnhancedEffect = typeof window === 'undefined' ? React.useEffect : React.useLayoutEffect;

const MenuList = React.forwardRef<HTMLUListElement, MenuListProps>(function MenuList(props, ref) {
  const {
    autoFocus = false,
    autoFocusItem = false,
    children,
    className,
    disabledItemsFocusable = false,
    disableListWrap = false,
    variant = 'selectedMenu',
    onKeyDown,
    ...other
  } = props;
  const listRef: MutableRefObject<HTMLUListElement | null> = React.useRef<HTMLUListElement>(null);
  const textCriteriaRef = React.useRef<{
    keys: string[];
    repeating: boolean;
    previousKeyMatched: boolean;
    lastTime: number;
  }>({
    keys: [],
    repeating: true,
    previousKeyMatched: true,
    lastTime: 0,
  });

  useEnhancedEffect(() => {
    if (autoFocus) {
      listRef.current?.focus();
    }
  }, [autoFocus]);

  React.useImperativeHandle(
    undefined,
    () => ({
      adjustStyleForScrollbar: (containerElement, theme) => {
        // Let's ignore that piece of logic if users are already overriding the width
        // of the menu.
        const noExplicitWidth = !listRef.current?.style.width;
        if (containerElement.clientHeight < listRef.current?.clientHeight! && noExplicitWidth) {
          const scrollbarSize = `${getScrollbarSize(true)}px`;
          if (listRef.current) {
            listRef.current.style[
              theme.direction === 'rtl' ? 'paddingLeft' : 'paddingRight'
            ] = scrollbarSize;
            listRef.current.style.width = `calc(100% + ${scrollbarSize})`;
          }
        }
        return listRef.current;
      },
    }),
    []
  );

  const handleKeyDown = (event: KeyboardEvent<HTMLUListElement>) => {
    const list = listRef.current;
    const key = event.key;
    /**
     * @type {Element} - will always be defined since we are in a keydown handler
     * attached to an element. A keydown event is either dispatched to the activeElement
     * or document.body or document.documentElement. Only the first case will
     * trigger this specific handler.
     */
    const currentFocus = ownerDocument(list as Node).activeElement;

    if (key === 'ArrowDown') {
      // Prevent scroll of the page
      event.preventDefault();
      moveFocus(list, currentFocus, disableListWrap, disabledItemsFocusable, nextItem);
    } else if (key === 'ArrowUp') {
      event.preventDefault();
      moveFocus(list, currentFocus, disableListWrap, disabledItemsFocusable, previousItem);
    } else if (key === 'Home') {
      event.preventDefault();
      moveFocus(list, null, disableListWrap, disabledItemsFocusable, nextItem);
    } else if (key === 'End') {
      event.preventDefault();
      moveFocus(list, null, disableListWrap, disabledItemsFocusable, previousItem);
    } else if (key.length === 1) {
      const criteria = textCriteriaRef.current;
      const lowerKey = key.toLowerCase();
      const currTime = performance.now();
      if (criteria.keys.length > 0) {
        // Reset
        if (currTime - criteria.lastTime > 500) {
          criteria.keys = [];
          criteria.repeating = true;
          criteria.previousKeyMatched = true;
        } else if (criteria.repeating && lowerKey !== criteria.keys[0]) {
          criteria.repeating = false;
        }
      }
      criteria.lastTime = currTime;
      criteria.keys.push(lowerKey);
      const keepFocusOnCurrent =
        currentFocus && !criteria.repeating && textCriteriaMatches(currentFocus, criteria);
      if (
        criteria.previousKeyMatched &&
        (keepFocusOnCurrent ||
          moveFocus(list, currentFocus, false, disabledItemsFocusable, nextItem, criteria))
      ) {
        event.preventDefault();
      } else {
        criteria.previousKeyMatched = false;
      }
    }

    if (onKeyDown) {
      onKeyDown(event);
    }
  };

  const handleOwnRef = React.useCallback(instance => {
    // #StrictMode ready
    listRef.current = ReactDOM.findDOMNode(instance) as MutableRefObject<
      HTMLUListElement
    >['current'];
  }, []);
  const handleRef = useForkRef(handleOwnRef, ref);

  /**
   * the index of the item should receive focus
   * in a `variant="selectedMenu"` it's the first `selected` item
   * otherwise it's the very first item.
   */
  let activeItemIndex = -1;
  // since we inject focus related props into children we have to do a lookahead
  // to check if there is a `selected` item. We're looking for the last `selected`
  // item and use the first valid item as a fallback
  React.Children.forEach(children, (child, index) => {
    if (!React.isValidElement(child)) {
      return;
    }

    if (process.env.NODE_ENV !== 'production') {
      if (isFragment(child)) {
        console.error(
          [
            "Material-UI: The Menu component doesn't accept a Fragment as a child.",
            'Consider providing an array instead.',
          ].join('\n')
        );
      }
    }

    if (!child.props.disabled) {
      if (variant === 'selectedMenu' && child.props.selected) {
        activeItemIndex = index;
      } else if (activeItemIndex === -1) {
        activeItemIndex = index;
      }
    }
  });

  const items = React.Children.map(
    children as ReactElement<MenuItemProps, 'li'>,
    (child, index) => {
      if (index === activeItemIndex) {
        const newChildProps = {} as MenuItemProps;
        if (autoFocusItem) {
          newChildProps.autoFocus = true;
        }
        if (child?.props.tabIndex === undefined && variant === 'selectedMenu') {
          newChildProps.tabIndex = 0;
        }

        return React.cloneElement(child, newChildProps);
      }

      return child;
    }
  );

  return (
    <List
      role="menu"
      ref={handleRef}
      className={className}
      onKeyDown={handleKeyDown}
      tabIndex={autoFocus ? 0 : -1}
      {...other}
    >
      {items}
    </List>
  );
});

export default MenuList;
