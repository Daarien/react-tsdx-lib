import React from 'react';
import { mergeClasses } from '@material-ui/styles';
import ArrowDropDownIcon from '../svg-icons/ArrowDropDown';
import formControlState from '../FormControl/formControlState';
import useFormControl from '../FormControl/useFormControl';
import withStyles from '../styles/withStyles';
import Input, { InputProps } from '../Input';
import { MenuProps } from '@material-ui/core/Menu';
import SelectInput, { SelectInputProps } from './SelectInput';
import { StandardProps } from '..';

export type SelectClassKey =
  | 'root'
  | 'select'
  | 'outlined'
  | 'selectMenu'
  | 'disabled'
  | 'icon'
  | 'iconOpen';

export interface SelectProps
  extends StandardProps<InputProps, SelectClassKey, 'value' | 'onChange'>,
    Pick<SelectInputProps, 'onChange'> {
  /**
   * The option elements to populate the select with.
   */
  children?: React.ReactNode;
  /**
   * If `true`, the width of the popover will automatically be set according to the items inside the
   * menu, otherwise it will be at least the width of the select input.
   */
  autoWidth?: boolean;
  /**
   * If `true`, a value is displayed even if no items are selected.
   *
   * In order to display a meaningful value, a function should be passed to the `renderValue` prop which returns the value to be displayed when no items are selected.
   * You can only use it when the `native` prop is `false` (default).
   */
  displayEmpty?: boolean;
  /**
   * The icon that displays the arrow.
   */
  IconComponent?: React.ElementType;
  /**
   * An `Input` element; does not have to be a material-ui specific `Input`.
   */
  input?: React.ReactElement<any, any>;
  /**
   * [Attributes](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#Attributes) applied to the `input` element.
   * When `native` is `true`, the attributes are applied on the `select` element.
   */
  inputProps?: InputProps['inputProps'];
  /**
   * See [OutlinedInput#label](/api/outlined-input/#props)
   */
  label?: React.ReactNode;
  /**
   * The ID of an element that acts as an additional label. The Select will
   * be labelled by the additional label and the selected value.
   */
  labelId?: string;
  /**
   * See [OutlinedInput#label](/api/outlined-input/#props)
   */
  labelWidth?: number;
  /**
   * Props applied to the [`Menu`](/api/menu/) element.
   */
  MenuProps?: Partial<MenuProps>;
  /**
   * If `true`, `value` must be an array and the menu will support multiple selections.
   */
  multiple?: boolean;
  /**
   * If `true`, the component will be using a native `select` element.
   */
  native?: boolean;
  /**
   * Callback function fired when a menu item is selected.
   *
   * @param {object} event The event source of the callback.
   * You can pull out the new value by accessing `event.target.value` (any).
   * @param {object} [child] The react element that was selected when `native` is `false` (default).
   * @document
   */
  onChange?: SelectInputProps['onChange'];
  /**
   * Callback fired when the component requests to be closed.
   * Use in controlled mode (see open).
   *
   * @param {object} event The event source of the callback.
   */
  onClose?: (event: React.ChangeEvent<{}>) => void;
  /**
   * Callback fired when the component requests to be opened.
   * Use in controlled mode (see open).
   *
   * @param {object} event The event source of the callback.
   */
  onOpen?: (event: React.ChangeEvent<{}>) => void;
  /**
   * Control `select` open state.
   * You can only use it when the `native` prop is `false` (default).
   */
  open?: boolean;
  /**
   * Render the selected value.
   * You can only use it when the `native` prop is `false` (default).
   *
   * @param {any} value The `value` provided to the component.
   * @returns {ReactNode}
   */
  renderValue?: (value: SelectProps['value']) => React.ReactNode;
  /**
   * Props applied to the clickable div element.
   */
  SelectDisplayProps?: React.HTMLAttributes<HTMLDivElement>;
  /**
   * The input value. Providing an empty string will select no options.
   * This prop is required when the `native` prop is `false` (default).
   * Set to an empty string `''` if you don't want any of the available options to be selected.
   *
   * If the value is an object it must have reference equality with the option in order to be selected.
   * If the value is not an object, the string representation must match with the string representation of the option in order to be selected.
   * @document
   */
  value?: unknown;
}

const Select = React.forwardRef(function Select(props: SelectProps, ref) {
  const {
    children,
    classes,
    displayEmpty = false,
    IconComponent = ArrowDropDownIcon,
    id,
    input,
    inputProps,
    // label,
    labelId,
    // labelWidth = 0,
    autoWidth = false,
    MenuProps,
    multiple = false,
    native = false,
    onClose,
    onOpen,
    open,
    renderValue,
    SelectDisplayProps,
    variant: variantProps = 'default',
    ...other
  } = props;

  const formControl = useFormControl();
  const fcs = formControlState({
    props,
    formControl,
    states: ['variant'],
  });

  const variant = fcs.variant || variantProps;

  const InputComponent = input || <Input variant={variant} />;

  return React.cloneElement(InputComponent, {
    inputComponent: SelectInput,
    inputProps: {
      children,
      IconComponent,
      variant,
      type: undefined, // We render a select. We can ignore the type provided by the `Input`.
      multiple,
      ...(native
        ? { id }
        : {
            autoWidth,
            displayEmpty,
            labelId,
            MenuProps,
            onClose,
            onOpen,
            open,
            renderValue,
            SelectDisplayProps: { id, ...SelectDisplayProps },
          }),
      ...inputProps,
      classes: inputProps
        ? mergeClasses({
            baseClasses: classes,
            newClasses: inputProps.classes,
            Component: Select,
          })
        : classes,
    },
    ref,
    ...other,
  });
});

export default withStyles(
  theme => ({
    /* Styles applied to the select component `root` class. */
    root: {},
    /* Styles applied to the select component `select` class. */
    select: {
      '-moz-appearance': 'none', // Reset
      '-webkit-appearance': 'none', // Reset
      // When interacting quickly, the text can end up selected.
      // Native select can't be selected either.
      userSelect: 'none',
      borderRadius: 0, // Reset
      minWidth: 16, // So it doesn't collapse.
      paddingRight: 32,
      cursor: 'pointer',
      '&:focus': {
        // Show that it's not an text input
        backgroundColor:
          theme.palette.type === 'light' ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.05)',
        borderRadius: 0, // Reset Chrome style
      },
      // Remove IE 11 arrow
      '&::-ms-expand': {
        display: 'none',
      },
      '&$disabled': {
        cursor: 'default',
      },
      '&[multiple]': {
        height: 'auto',
      },
      '&:not([multiple]) option, &:not([multiple]) optgroup': {
        backgroundColor: theme.palette.background.paper,
      },
    },
    /* Styles applied to the select component if `variant="outlined"`. */
    outlined: {},
    /* Styles applied to the select component `selectMenu` class. */
    selectMenu: {
      height: 'auto', // Resets for multpile select with chips
      minHeight: '1.1876em', // Required for select\text-field height consistency
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
    },
    /* Pseudo-class applied to the select component `disabled` class. */
    disabled: {},
    /* Styles applied to the icon component. */
    icon: {
      // We use a position absolute over a flexbox in order to forward the pointer events
      // to the input and to support wrapping tags..
      position: 'absolute',
      right: 7,
      top: 'calc(50% - 12px)', // Center vertically
      pointerEvents: 'none', // Don't block pointer events on the select under the icon.
      color: theme.palette.action.active,
      '&$disabled': {
        color: theme.palette.action.disabled,
      },
    },
    /* Styles applied to the icon component if the popup is open. */
    iconOpen: {
      transform: 'rotate(180deg)',
    },
    /* Styles applied to the underlying native input component. */
    nativeInput: {
      bottom: 0,
      left: 0,
      position: 'absolute',
      opacity: 0,
      pointerEvents: 'none',
      width: '100%',
    },
  }),
  { name: 'SuiSelect' }
)(Select);
