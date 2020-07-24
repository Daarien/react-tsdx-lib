import React, { HTMLAttributes, MutableRefObject } from 'react';
import ReactDOM from 'react-dom';
import clsx from 'clsx';
import withStyles from '../styles/withStyles';
import ButtonBase from '../ButtonBase';
import useForkRef from '../utils/useForkRef';
import { StandardProps } from '..';

export interface ListItemProps
  extends StandardProps<HTMLAttributes<HTMLLIElement>, ListItemClassKey> {
  alignItems?: 'flex-start' | 'center';
  autoFocus?: boolean;
  button?: boolean;
  dense?: boolean;
  disabled?: boolean;
  disableGutters?: boolean;
  divider?: boolean;
  selected?: boolean;
  component?: React.ElementType;
}

const useEnhancedEffect = typeof window === 'undefined' ? React.useEffect : React.useLayoutEffect;

const ListItem = React.forwardRef<HTMLLIElement, ListItemProps>(function ListItem(props, ref) {
  const {
    alignItems = 'center',
    autoFocus = false,
    button = false,
    children: childrenProp,
    classes,
    className,
    dense = false,
    disabled = false,
    disableGutters = false,
    divider = false,
    selected = false,
    component = 'li',
    ...other
  } = props;

  const listItemRef = React.useRef<HTMLLIElement | null>(null);
  useEnhancedEffect(() => {
    if (autoFocus) {
      if (listItemRef.current) {
        listItemRef.current?.focus();
      } else if (process.env.NODE_ENV !== 'production') {
        console.error(
          'Material-UI: Unable to set focus to a ListItem whose component has not been rendered.'
        );
      }
    }
  }, [autoFocus]);

  const children = React.Children.toArray(childrenProp);

  const handleOwnRef = React.useCallback(instance => {
    // #StrictMode ready
    listItemRef.current = ReactDOM.findDOMNode(
      instance
    ) as MutableRefObject<HTMLLIElement | null>['current'];
  }, []);
  const handleRef = useForkRef(handleOwnRef, ref);

  const componentProps: Partial<ListItemProps> = {
    className: clsx(
      classes.root,
      {
        [classes.gutters]: !disableGutters,
        [classes.divider]: divider,
        [classes.disabled]: disabled,
        [classes.button]: button,
        [classes.alignItemsFlexStart]: alignItems === 'flex-start',
        [classes.selected]: selected,
      },
      className
    ),
    disabled,
    ...other,
  };

  let Component = component;
  if (button) {
    componentProps.component = component;
    Component = ButtonBase;
  }

  return (
    <Component ref={handleRef} {...componentProps}>
      {children}
    </Component>
  );
});

export type ListItemClassKey =
  | 'root'
  | 'container'
  | 'focusVisible'
  | 'disabled'
  | 'divider'
  | 'gutters'
  | 'button'
  | 'selected'
  | 'alignItemsFlexStart';

export default withStyles(
  theme => ({
    /* Styles applied to the (normally root) `component` element. May be wrapped by a `container`. */
    root: {
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'center',
      position: 'relative',
      textDecoration: 'none',
      width: '100%',
      boxSizing: 'border-box',
      textAlign: 'left',
      paddingTop: 8,
      paddingBottom: 8,
      '&$focusVisible': {
        backgroundColor: theme.palette.action.selected,
      },
      '&$selected, &$selected:hover': {
        backgroundColor: theme.palette.action.selected,
      },
      '&$disabled': {
        opacity: 0.5,
      },
    },
    /* Styles applied to the `container` element if `children` includes `ListItemSecondaryAction`. */
    container: {
      position: 'relative',
    },
    /* Pseudo-class applied to the `component`'s `focusVisibleClassName` prop if `button={true}`. */
    focusVisible: {},
    /* Styles applied to the `component` element if `alignItems="flex-start"`. */
    alignItemsFlexStart: {
      alignItems: 'flex-start',
    },
    /* Pseudo-class applied to the inner `component` element if `disabled={true}`. */
    disabled: {},
    /* Styles applied to the inner `component` element if `divider={true}`. */
    divider: {
      borderBottom: `1px solid ${theme.palette.divider}`,
      backgroundClip: 'padding-box',
    },
    /* Styles applied to the inner `component` element if `disableGutters={false}`. */
    gutters: {
      paddingLeft: 16,
      paddingRight: 16,
    },
    /* Styles applied to the inner `component` element if `button={true}`. */
    button: {
      transition: theme.transitions.create('background-color', {
        duration: theme.transitions.duration.shortest,
      }),
      '&:hover': {
        textDecoration: 'none',
        backgroundColor: theme.palette.action.hover,
        // Reset on touch devices, it doesn't add specificity
        '@media (hover: none)': {
          backgroundColor: 'transparent',
        },
      },
    },
    /* Pseudo-class applied to the root element if `selected={true}`. */
    selected: {},
  }),
  { name: 'SuiListItem' }
)(ListItem);
