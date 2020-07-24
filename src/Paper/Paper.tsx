import React, { HTMLAttributes } from 'react';
import clsx from 'clsx';
import withStyles from '../styles/withStyles';
import { StandardProps } from '..';

export type PaperClassKey = 'root';

export interface PaperProps extends StandardProps<HTMLAttributes<HTMLDivElement>, PaperClassKey> {}

function Paper({ children, className, classes, ...other }: PaperProps) {
  return (
    <div className={clsx(classes.root, className)} {...other}>
      {children}
    </div>
  );
}

export default withStyles(
  theme => {
    return {
      root: {
        boxShadow: theme.shadows[1],
        borderRadius: theme.shape.borderRadius,
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        transition: theme.transitions.create('box-shadow'),
      },
    };
  },
  { name: 'SuiPaper' }
)(Paper);
