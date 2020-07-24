import React, { HTMLAttributes } from 'react';
import clsx from 'clsx';
import withStyles from '../styles/withStyles';
import { StandardProps } from '..';

export interface ListProps extends StandardProps<HTMLAttributes<HTMLUListElement>, ListClassKey> {
  subheader?: React.ReactElement;
}

const List = React.forwardRef<HTMLUListElement, ListProps>(function List(props, ref) {
  const { children, classes, className, subheader, ...other } = props;

  return (
    <ul
      className={clsx(
        classes.root,
        {
          [classes.subheader]: subheader,
        },
        className
      )}
      ref={ref}
      {...other}
    >
      {subheader}
      {children}
    </ul>
  );
});

export type ListClassKey = 'root' | 'subheader';

export default withStyles(
  {
    /* Styles applied to the root element. */
    root: {
      listStyle: 'none',
      margin: 0,
      padding: 0,
      position: 'relative',
    },
    /* Styles applied to the root element if a `subheader` is provided. */
    subheader: {
      paddingTop: 0,
    },
  },
  { name: 'SuiList' }
)(List);
