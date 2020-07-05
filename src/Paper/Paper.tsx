import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
// import withStyles from '../styles/withStyles';
import clsx from 'clsx';

export type PaperClassKey = 'root';

export interface PaperProps extends React.HTMLAttributes<HTMLDivElement> {
  classes: Record<PaperClassKey, string>;
}

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
        boxShadow:
          '0px 1px 3px 0px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 2px 1px -1px rgba(0, 0, 0, 0.12)',
        borderRadius: theme.shape.borderRadius,
        padding: '1rem',
      },
    };
  },
  { name: 'SuiPaper' }
)(Paper);
