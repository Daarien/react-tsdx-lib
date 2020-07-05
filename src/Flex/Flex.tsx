import React, { ComponentProps } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';

type Justify = 'flex-start' | 'center' | 'flex-end' | 'space-around' | 'space-between';

type Align = 'flex-start' | 'center' | 'flex-end' | 'stretch';

type Direction = 'row' | 'column';

type FlexProps = ComponentProps<'div'> & {
  justify?: Justify;
  align?: Align;
  direction?: Direction;
  wrap?: boolean;
};

const useStyles = makeStyles({
  root: {
    display: 'flex',
    justifyContent: ({ justify }: FlexProps) => justify,
    alignItems: ({ align }: FlexProps) => align,
    flexWrap: ({ wrap }) => (wrap ? 'wrap' : undefined),
  },
});

function Flex(props: FlexProps) {
  const { children, className, justify, align, direction, wrap, ...other } = props;
  const classes = useStyles(props);

  return (
    <div className={clsx(classes.root, className)} {...other}>
      {children}
    </div>
  );
}

export default Flex;
