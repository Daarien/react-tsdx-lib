import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import SwitchBase, { SwitchBaseProps, SwitchBaseClassKey } from '../internal/SwitchBase';
import CheckOnIcon from '../svg/check_on.svg';
import CheckOffIcon from '../svg/check_off.svg';
// import clsx from 'clsx';

const defaultCheckedIcon = <img src={CheckOnIcon} alt="check-on" />;
const defaultIcon = <img src={CheckOffIcon} alt="check-off" />;

type CheckboxClassKey = SwitchBaseClassKey;

export interface CheckboxProps extends Omit<SwitchBaseProps, 'icon' | 'checkedIcon' | 'type'> {
  icon?: React.ReactNode;
  checkedIcon?: React.ReactNode;
  size?: 'small' | 'medium';
  classes: Record<CheckboxClassKey, string>;
  inputProps?: SwitchBaseProps['inputProps'];
}

const Checkbox = React.forwardRef(function Checkbox(props: CheckboxProps, ref) {
  const {
    classes,
    checked,
    disabled,
    className,
    inputProps,
    checkedIcon = defaultCheckedIcon,
    icon = defaultIcon,
    // size = "medium",
    ...other
  } = props;
  return (
    <SwitchBase
      type="checkbox"
      classes={{
        root: classes.root,
        checked: classes.checked,
        disabled: classes.disabled,
        input: classes.input,
      }}
      icon={icon}
      checkedIcon={checkedIcon}
      inputProps={inputProps}
      ref={ref}
      {...other}
    />
  );
});

export default withStyles(
  () => ({
    root: {},
    checked: {},
    disabled: {},
    input: {},
  }),
  { name: 'SuiCheckbox' }
)(Checkbox);
