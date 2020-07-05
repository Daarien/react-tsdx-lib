import React from 'react';
import clsx from 'clsx';
import { Theme } from '@material-ui/core/styles';
import withStyles, { Styles } from '@material-ui/core/styles/withStyles';
import useFormControl from '../FormControl/useFormControl';
import capitalize from '../utils/capitalize';

export type FormControlLabelClassKey =
  | 'root'
  | 'labelPlacementStart'
  | 'labelPlacementTop'
  | 'labelPlacementBottom'
  | 'disabled'
  | 'label';

export interface FormControlLabelProps
  extends Omit<React.LabelHTMLAttributes<HTMLLabelElement>, 'children' | 'onChange'> {
  checked?: boolean;
  disabled?: boolean;
  label: string;
  labelPlacement?: 'end' | 'start' | 'top' | 'bottom';
  name?: string;
  value?: unknown;
  /**
   * A control element. For instance, it can be be a `Radio`, a `Switch` or a `Checkbox`.
   */
  control: React.ReactElement<any, any>;
  onChange?: (event: React.ChangeEvent<unknown>, checked: boolean) => void;
  classes: Record<FormControlLabelClassKey, string>;
}

const FormControlLabel = React.forwardRef<HTMLLabelElement, FormControlLabelProps>(
  function FormControlLabel(props: FormControlLabelProps, ref) {
    const {
      className,
      classes,
      label,
      checked,
      disabled: disabledProp,
      labelPlacement = 'end',
      control,
      onChange,
      ...other
    } = props;

    const formControlState = useFormControl();

    let disabled = disabledProp;
    if (typeof disabled === 'undefined' && typeof control.props.disabled !== 'undefined') {
      disabled = control.props.disabled;
    }
    if (typeof disabled === 'undefined' && formControlState) {
      disabled = formControlState.disabled;
    }

    const controlProps: Record<string, any> = {
      disabled,
    };

    ['checked', 'name', 'onChange', 'value', 'inputRef'].forEach(key => {
      if (typeof control.props[key] === 'undefined' && typeof props[key] !== 'undefined') {
        controlProps[key] = props[key];
      }
    });

    return (
      <label
        className={clsx(
          classes.root,
          {
            [classes[`labelPlacement${capitalize(labelPlacement)}`]]: labelPlacement !== 'end',
            [classes.disabled]: disabled,
          },
          className
        )}
        ref={ref}
        {...other}
      >
        {React.cloneElement(control, controlProps)}
        <span className={clsx(classes.label, { [classes.disabled]: disabled })}>{label}</span>
      </label>
    );
  }
);

const styles: Styles<Theme, {}, FormControlLabelClassKey> = theme => ({
  /* Styles applied to the root element. */
  root: {
    display: 'inline-flex',
    alignItems: 'center',
    cursor: 'pointer',
    // For correct alignment with the text.
    verticalAlign: 'middle',
    WebkitTapHighlightColor: 'transparent',
    marginLeft: -11,
    marginRight: 16, // used for row presentation of radio/checkbox
    '&$disabled': {
      cursor: 'default',
    },
  },
  /* Styles applied to the root element if `labelPlacement="start"`. */
  labelPlacementStart: {
    flexDirection: 'row-reverse',
    marginLeft: 16, // used for row presentation of radio/checkbox
    marginRight: -11,
  },
  /* Styles applied to the root element if `labelPlacement="top"`. */
  labelPlacementTop: {
    flexDirection: 'column-reverse',
    marginLeft: 16,
  },
  /* Styles applied to the root element if `labelPlacement="bottom"`. */
  labelPlacementBottom: {
    flexDirection: 'column',
    marginLeft: 16,
  },
  /* Pseudo-class applied to the root element if `disabled={true}`. */
  disabled: {},
  /* Styles applied to the label's Typography component. */
  label: {
    '&$disabled': {
      color: theme.palette.text.disabled,
    },
  },
});

export default withStyles(styles, { name: 'SuiFormControlLabel' })(FormControlLabel);
