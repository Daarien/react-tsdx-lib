import React from 'react';
import styled from '@material-ui/core/styles/styled';
import clsx from 'clsx';

export interface FormGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  row?: boolean;
}

function FormGroup(props: FormGroupProps) {
  const { className, row, ...other } = props;
  return <div className={clsx({ row }, className)} {...other} />;
}

export default styled(FormGroup)({
  display: 'flex',
  flexDirection: 'column',
  flexWrap: 'wrap',
  '&.row': {
    flexDirection: 'row',
  },
});
