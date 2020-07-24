import React, { HTMLAttributes } from 'react';
import clsx from 'clsx';
import Input, { InputProps as StandardInputProps } from '../Input';
import InputLabel, { InputLabelProps } from '../InputLabel';
import FormHelperText, { FormHelperTextProps } from '../FormHelperText';
import FormControl, { FormControlProps } from '../FormControl';
import Select, { SelectProps } from '../Select';
import { StandardProps } from '..';
import withStyles from '../styles/withStyles';

type TextFieldClassKey = 'root';

export interface TextFieldProps
  extends StandardProps<
    HTMLAttributes<HTMLDivElement>,
    TextFieldClassKey,
    'defaultValue' | 'onFocus' | 'onBlur' | 'onChange'
  > {
  autoComplete?: string;
  autoFocus?: boolean;
  defaultValue?: string | number;
  disabled?: boolean;
  error?: boolean;
  fullWidth?: boolean;
  helperText?: React.ReactNode;
  FormHelperTextProps?: Partial<FormHelperTextProps>;
  /**
   * The id of the `input` element.
   * Use this prop to make `label` and `helperText` accessible for screen readers.
   */
  id?: string;
  /**
   * Pass a ref to the `input` element.
   */
  inputRef?: React.Ref<any>;
  /**
   * The label content.
   */
  label?: React.ReactNode;
  InputLabelProps?: Partial<InputLabelProps>;
  multiline?: boolean;
  name?: string;
  placeholder?: string;
  required?: boolean;
  rows?: number;
  rowsMax?: string | number;
  select?: boolean;
  SelectProps?: Partial<SelectProps>;
  size?: 'small' | 'medium' | 'large';
  variant?: 'default' | 'outlined';
  /**
   * Type of the `input` element. It should be [a valid HTML5 input type](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#Form_%3Cinput%3E_types).
   */
  type?: React.InputHTMLAttributes<unknown>['type'];
  /**
   * The value of the `input` element, required for a controlled component.
   */
  value?: string | number;
  /**
   * Callback fired when the value is changed.
   *
   * @param {object} event The event source of the callback.
   * You can pull out the new value by accessing `event.target.value` (string).
   */
  onChange?: StandardInputProps['onChange'];
  onFocus?: StandardInputProps['onFocus'];
  onBlur?: StandardInputProps['onBlur'];
  /**
   * Props applied to the Input element.
   * It will be a [`FilledInput`](/api/filled-input/),
   * [`OutlinedInput`](/api/outlined-input/) or [`Input`](/api/input/)
   * component depending on the `variant` prop value.
   */
  InputProps?: Partial<StandardInputProps>;
  /**
   * [Attributes](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#Attributes) applied to the `input` element.
   */
  inputProps?: StandardInputProps['inputProps'];
}

const TextField = React.forwardRef<HTMLDivElement, TextFieldProps>(function TextField(props, ref) {
  const {
    children,
    classes,
    className,
    autoComplete,
    autoFocus = false,
    defaultValue,
    variant,
    disabled = false,
    error = false,
    fullWidth = false,
    helperText,
    id,
    inputProps,
    InputProps,
    inputRef,
    label,
    multiline = false,
    name,
    onBlur,
    onChange,
    onFocus,
    placeholder,
    required = false,
    rows,
    rowsMax,
    select = false,
    SelectProps,
    type,
    value,
    FormHelperTextProps,
    InputLabelProps,
    ...other
  } = props;

  const helperTextId = helperText && id ? `${id}-helper-text` : undefined;
  const inputLabelId = label && id ? `${id}-label` : undefined;

  const InputElement = (
    <Input
      aria-describedby={helperTextId}
      autoComplete={autoComplete}
      autoFocus={autoFocus}
      defaultValue={defaultValue}
      fullWidth={fullWidth}
      multiline={multiline}
      name={name}
      rows={rows}
      rowsMax={rowsMax}
      type={type}
      value={value}
      id={id}
      inputRef={inputRef}
      onBlur={onBlur}
      onChange={onChange}
      onFocus={onFocus}
      placeholder={placeholder}
      disabled={disabled}
      inputProps={inputProps}
      {...InputProps}
    />
  );

  return (
    <FormControl
      className={clsx(classes.root, className)}
      disabled={disabled}
      error={error}
      fullWidth={fullWidth}
      required={required}
      variant={variant}
      ref={ref}
      {...(other as FormControlProps)}
    >
      {label && (
        <InputLabel htmlFor={id} id={inputLabelId} {...InputLabelProps}>
          {label}
        </InputLabel>
      )}
      {select ? (
        <Select
          aria-describedby={helperTextId}
          id={id}
          labelId={inputLabelId}
          value={value}
          input={InputElement}
          {...SelectProps}
        >
          {children}
        </Select>
      ) : (
        InputElement
      )}

      {helperText && (
        <FormHelperText id={helperTextId} {...FormHelperTextProps}>
          {helperText}
        </FormHelperText>
      )}
    </FormControl>
  );
});

export default withStyles(
  {
    root: {},
  },
  { name: 'SuiTextField' }
)(TextField);
