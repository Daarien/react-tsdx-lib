import React, { ComponentProps, ReactNode, MouseEvent } from 'react';
import { isFragment } from 'react-is';
import clsx from 'clsx';
import capitalize from '../utils/capitalize';
import { InputBaseProps } from '../InputBase';
import { isFilled } from '../InputBase/utils';
import { StandardProps } from '..';
import formControlState from '../FormControl/formControlState';
import useFormControl from '../FormControl/useFormControl';
import useControlled from '../utils/useControlled';
import useForkRef from '../utils/useForkRef';
import { ownerDocument } from '@material-ui/core/utils';
import Menu, { MenuProps } from '../Menu';

type SelectValue = string | undefined;
type SelectOption = React.ReactElement<
  ComponentProps<'option'> & { 'aria-selected'?: string; 'data-value'?: any; value?: any }
>;

export type SelectInputClassKey =
  | 'root'
  | 'select'
  | 'selectMenu'
  | 'disabled'
  | 'icon'
  | 'iconOpen'
  | 'nativeInput';

export interface SelectInputProps
  extends StandardProps<InputBaseProps, SelectInputClassKey, 'onChange'> {
  'aria-label'?: string;
  autoFocus?: boolean;
  autoWidth: boolean;
  disabled?: boolean;
  labelId?: string;
  displayEmpty?: boolean;
  IconComponent?: React.ElementType;
  inputRef?: (
    ref: HTMLSelectElement | { node: HTMLInputElement; value: SelectInputProps['value'] }
  ) => void;
  MenuProps?: MenuProps;
  multiple: boolean;
  name?: string;
  native: boolean;
  onBlur?: React.FocusEventHandler<any>;
  // onChange?: (
  //   event: React.ChangeEvent<{ name?: string; value: unknown }>,
  //   child: React.ReactNode
  // ) => void;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>, child: React.ReactNode) => void;
  onClose?: (event: React.ChangeEvent<{}>) => void;
  onFocus?: React.FocusEventHandler<any>;
  onOpen?: (event: React.ChangeEvent<{}>) => void;
  open?: boolean;
  readOnly?: boolean;
  renderValue?: (value: SelectInputProps['value']) => React.ReactNode;
  SelectDisplayProps?: React.HTMLAttributes<HTMLDivElement>;
  tabIndex?: number;
  defaultValue?: string;
  value?: SelectValue;
  variant?: 'default' | 'outlined';
}

const SelectInput = React.forwardRef<HTMLDivElement, SelectInputProps>(function SelectInput(
  props,
  ref
) {
  const {
    'aria-label': ariaLabel,
    autoFocus,
    autoWidth,
    children,
    classes,
    className,
    defaultValue,
    disabled,
    displayEmpty,
    IconComponent = 'svg',
    inputRef: inputRefProp,
    labelId,
    MenuProps = {} as Partial<MenuProps> & { classes: MenuProps['classes'] },
    multiple,
    name,
    onBlur,
    onChange,
    onClose,
    onFocus,
    onOpen,
    open: openProp,
    readOnly,
    renderValue,
    SelectDisplayProps = {},
    tabIndex: tabIndexProp,
    // catching `type` from Input which makes no sense for SelectInput
    type,
    value: valueProp,
    variant = 'default',
    ...other
  } = props;

  const [value, setValue] = useControlled<SelectValue>({
    controlled: valueProp,
    default: defaultValue,
    name: 'Select',
  });

  const [focused, setFocused] = React.useState(false);

  const formControl = useFormControl();
  console.log('formControl', formControl);

  const fcs = formControlState({
    props,
    formControl,
    states: ['focused'],
  });

  fcs.focused = formControl ? formControl.focused : focused;

  const inputRef = React.useRef<HTMLInputElement>(null);
  const [displayNode, setDisplayNode] = React.useState<HTMLDivElement | null>(null);
  const { current: isOpenControlled } = React.useRef(openProp ?? false);
  const [menuMinWidthState, setMenuMinWidthState] = React.useState<number | undefined>();
  const [openState, setOpenState] = React.useState(false);
  const handleRef = useForkRef(ref, inputRefProp);

  React.useImperativeHandle(
    handleRef,
    () => ({
      focus: () => {
        displayNode?.focus();
      },
      blur: () => {
        displayNode?.blur();
      },
      node: inputRef.current,
      value,
    }),
    [displayNode, value]
  );

  React.useEffect(() => {
    if (autoFocus && displayNode) {
      displayNode.focus();
    }
  }, [autoFocus, displayNode]);

  React.useEffect(() => {
    if (displayNode) {
      const label = ownerDocument(displayNode).getElementById(labelId!);
      if (label) {
        const handler = () => {
          if (getSelection()?.isCollapsed) {
            displayNode.focus();
          }
        };
        label.addEventListener('click', handler);
        return () => {
          label.removeEventListener('click', handler);
        };
      }
    }

    return undefined;
  }, [labelId, displayNode]);

  const update = (open, event) => {
    if (open) {
      if (onOpen) {
        onOpen(event);
      }
    } else if (onClose) {
      onClose(event);
    }

    if (!isOpenControlled) {
      setMenuMinWidthState(autoWidth ? undefined : displayNode?.clientWidth);
      setOpenState(open);
    }
  };

  const handleMouseDown = (event: MouseEvent<HTMLDivElement>) => {
    // Ignore everything but left-click
    if (event.button !== 0) {
      return;
    }
    // Hijack the default focus behavior.
    event.preventDefault();
    displayNode?.focus();

    update(true, event);
  };

  const handleClose = event => {
    update(false, event);
  };

  const childrenArray = React.Children.toArray(children) as SelectOption[];

  // Support autofill.
  const handleChange = event => {
    console.log('handleChange event', event);
    const index = childrenArray.map(child => child.props.value).indexOf(event.target.value);

    if (index === -1) {
      return;
    }

    const child = childrenArray[index];
    setValue(child.props.value);

    if (onChange) {
      onChange(event, child);
    }
  };

  const handleItemClick = child => event => {
    if (!multiple) {
      update(false, event);
    }

    let newValue;

    if (multiple) {
      newValue = Array.isArray(value) ? value.slice() : [];
      const itemIndex = value?.indexOf(child.props.value);
      if (itemIndex === -1) {
        newValue.push(child.props.value);
      } else {
        newValue.splice(itemIndex, 1);
      }
    } else {
      newValue = child.props.value;
    }

    if (child.props.onClick) {
      child.props.onClick(event);
    }

    if (value === newValue) {
      return;
    }

    setValue(newValue);

    if (onChange) {
      event.persist();
      // Preact support, target is read only property on a native event.
      Object.defineProperty(event, 'target', { writable: true, value: { value: newValue, name } });
      onChange(event, child);
    }
  };

  const handleKeyDown = event => {
    if (!readOnly) {
      const validKeys = [
        ' ',
        'ArrowUp',
        'ArrowDown',
        // The native select doesn't respond to enter on MacOS, but it's recommended by
        // https://www.w3.org/TR/wai-aria-practices/examples/listbox/listbox-collapsible.html
        'Enter',
      ];

      if (validKeys.indexOf(event.key) !== -1) {
        event.preventDefault();
        update(true, event);
      }
    }
  };

  const open = displayNode !== null && (isOpenControlled ? !!openProp : openState);

  const handleBlur = event => {
    // if open event.stopImmediatePropagation
    if (!open && onBlur) {
      event.persist();
      // Preact support, target is read only property on a native event.
      Object.defineProperty(event, 'target', { writable: true, value: { value, name } });
      onBlur(event);
    }
    if (formControl && formControl.onBlur) {
      formControl.onBlur(event);
    } else {
      setFocused(false);
    }
  };

  delete other['aria-invalid'];

  let display;
  let displaySingle;
  const displayMultiple: ReactNode[] = [];
  let computeDisplay = false;
  let foundMatch = false;

  // No need to display any value if the field is empty.
  if (isFilled({ value }) || displayEmpty) {
    if (renderValue) {
      display = renderValue(value);
    } else {
      computeDisplay = true;
    }
  }

  const items = childrenArray.map(child => {
    if (!React.isValidElement(child)) {
      return null;
    }

    if (process.env.NODE_ENV !== 'production') {
      if (isFragment(child)) {
        console.error(
          [
            "SU-UI: The Select component doesn't accept a Fragment as a child.",
            'Consider providing an array instead.',
          ].join('\n')
        );
      }
    }

    let selected;

    if (multiple) {
      if (!Array.isArray(value)) {
        throw new Error(
          'SU-UI: The `value` prop must be an array ' +
            'when using the `Select` component with `multiple`.'
        );
      }

      selected = value.some(v => areEqualValues(v, child.props.value));
      if (selected && computeDisplay) {
        displayMultiple.push(child.props.children);
      }
    } else {
      selected = areEqualValues(value, child.props.value);
      if (selected && computeDisplay) {
        displaySingle = child.props.children;
      }
    }

    if (selected) {
      foundMatch = true;
    }

    return React.cloneElement(child, {
      'aria-selected': selected ? 'true' : undefined,
      onClick: handleItemClick(child),
      onKeyUp: event => {
        if (event.key === ' ') {
          // otherwise our MenuItems dispatches a click event
          // it's not behavior of the native <option> and causes
          // the select to close immediately since we open on space keydown
          event.preventDefault();
        }

        if (child.props.onKeyUp) {
          child.props.onKeyUp(event);
        }
      },
      role: 'option',
      selected,
      value: undefined, // The value is most likely not a valid HTML attribute.
      'data-value': child.props.value, // Instead, we provide it as a data attribute.
    });
  });

  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    React.useEffect(() => {
      if (!foundMatch && !multiple && value !== '') {
        const values = childrenArray.map(child => child.props.value);
        console.warn(
          [
            `SU-UI: You have provided an out-of-range value \`${value}\` for the select ${
              name ? `(name="${name}") ` : ''
            }component.`,
            "Consider providing a value that matches one of the available options or ''.",
            `The available values are ${values
              .filter(x => x != null)
              .map(x => `\`${x}\``)
              .join(', ') || '""'}.`,
          ].join('\n')
        );
      }
    }, [foundMatch, childrenArray, multiple, name, value]);
  }

  if (computeDisplay) {
    display = multiple ? displayMultiple.join(', ') : displaySingle;
  }

  // Avoid performing a layout computation in the render method.
  let menuMinWidth = menuMinWidthState;

  if (!autoWidth && isOpenControlled && displayNode) {
    menuMinWidth = displayNode.clientWidth;
  }

  let tabIndex;
  if (typeof tabIndexProp !== 'undefined') {
    tabIndex = tabIndexProp;
  } else {
    tabIndex = disabled ? null : 0;
  }

  const buttonId = SelectDisplayProps.id || (name ? `mui-component-select-${name}` : undefined);

  return (
    <React.Fragment>
      <div
        className={clsx(
          classes.root, // TODO v5: merge root and select
          classes.select,
          classes.selectMenu,
          classes[variant],
          {
            [classes.disabled]: disabled,
          },
          className
        )}
        ref={setDisplayNode}
        tabIndex={tabIndex}
        role="button"
        aria-disabled={disabled ? 'true' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="listbox"
        aria-label={ariaLabel}
        aria-labelledby={[labelId, buttonId].filter(Boolean).join(' ') || undefined}
        onKeyDown={handleKeyDown}
        onMouseDown={disabled || readOnly ? undefined : handleMouseDown}
        onBlur={handleBlur}
        onFocus={onFocus}
        {...SelectDisplayProps}
        // The id is required for proper a11y
        id={buttonId}
      >
        {/* So the vertical align positioning algorithm kicks in. */}
        {isEmpty(display) ? (
          // eslint-disable-next-line react/no-danger
          <span dangerouslySetInnerHTML={{ __html: '&#8203;' }} />
        ) : (
          display
        )}
      </div>
      <input
        value={Array.isArray(value) ? value.join(',') : value}
        name={name}
        ref={inputRef}
        aria-hidden
        onChange={handleChange}
        tabIndex={-1}
        className={classes.nativeInput}
        autoFocus={autoFocus}
        {...other}
      />
      <IconComponent
        className={clsx(classes.icon, classes[`icon${capitalize(variant)}`], {
          [classes.iconOpen]: open,
          [classes.disabled]: disabled,
        })}
      />
      <Menu
        id={`menu-${name || ''}`}
        anchorEl={displayNode}
        open={open}
        onClose={handleClose}
        {...MenuProps}
        MenuListProps={{
          'aria-labelledby': labelId,
          role: 'listbox',
          disableListWrap: true,
          ...MenuProps.MenuListProps,
        }}
        PaperProps={{
          ...MenuProps.PaperProps,
          style: {
            minWidth: menuMinWidth,
            ...(MenuProps.PaperProps != null ? MenuProps.PaperProps.style : null),
          },
        }}
      >
        {items}
      </Menu>
    </React.Fragment>
  );
});

export default SelectInput;

function areEqualValues(a, b) {
  if (typeof b === 'object' && b !== null) {
    return a === b;
  }

  return String(a) === String(b);
}

function isEmpty(display) {
  return display == null || (typeof display === 'string' && !display.trim());
}
