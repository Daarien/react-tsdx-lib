import React from 'react';
import clsx from 'clsx';
import InputBase, { InputBaseProps } from '../InputBase';
import withStyles from '../styles/withStyles';
import { Theme } from '../styles';
import { Styles } from '@material-ui/styles/withStyles';
import { StandardProps } from '..';

export interface InputProps extends StandardProps<InputBaseProps, InputClassKey> {
  variant?: 'default' | 'outlined';
}

type InputClassKey =
  | 'root'
  | 'outlined'
  | 'formControl'
  | 'focused'
  | 'disabled'
  | 'colorSecondary'
  | 'error'
  | 'marginDense'
  | 'multiline'
  | 'fullWidth'
  | 'input'
  | 'inputMarginDense'
  | 'inputMultiline'
  | 'inputTypeSearch';

export const styles: Styles<Theme, {}, InputClassKey> = theme => {
  return {
    /* Styles applied to the root element. */
    root: {
      position: 'relative',
      borderRadius: theme.shape.borderRadius,
    },
    /* Styles applied to the root element if the component is a descendant of `FormControl`. */
    outlined: {},
    formControl: {
      'label + &': {
        marginTop: 4,
      },
    },
    /* Styles applied to the root element if the component is focused. */
    focused: {},
    /* Styles applied to the root element if `disabled={true}`. */
    disabled: {},
    /* Styles applied to the root element if color secondary. */
    colorSecondary: {},
    /* Pseudo-class applied to the root element if `error={true}`. */
    error: {},
    /* Styles applied to the `input` element if `margin="dense"`. */
    marginDense: {},
    /* Styles applied to the root element if `multiline={true}`. */
    multiline: {},
    /* Styles applied to the root element if `fullWidth={true}`. */
    fullWidth: {},
    /* Styles applied to the `input` element. */
    input: {},
    /* Styles applied to the `input` element if `margin="dense"`. */
    inputMarginDense: {},
    /* Styles applied to the `input` element if `multiline={true}`. */
    inputMultiline: {},
    /* Styles applied to the `input` element if `type="search"`. */
    inputTypeSearch: {},
  };
};

const Input = React.forwardRef<HTMLDivElement, InputProps>(function Input(props: InputProps, ref) {
  const {
    classes,
    fullWidth = false,
    inputComponent = 'input',
    multiline = false,
    type = 'text',
    ...other
  } = props;

  return (
    <InputBase
      classes={{
        ...classes,
        root: clsx(classes.root),
      }}
      fullWidth={fullWidth}
      inputComponent={inputComponent}
      multiline={multiline}
      ref={ref}
      type={type}
      {...other}
    />
  );
});

export default withStyles(styles, { name: 'SuiInput' })(Input);
