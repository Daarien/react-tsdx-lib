import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Paper, ButtonBase, Button, Flex } from '../src';
import { StoryProps } from './types';

export default {
  title: 'Buttons',
};

// By passing optional props to this story, you can control the props of the component when
// you consume the story in a test.
export const ButtonExample = ({ id, name }: StoryProps) => {
  const classes = useStyles();
  return (
    <Paper id={id}>
      <h2>{name}</h2>
      <p>
        <ButtonBase>ButtonBase</ButtonBase>
      </p>
      <Flex className={classes.row}>
        <Button>default</Button>
        <Button color="primary">text primary</Button>
        <Button color="secondary">text secondary</Button>
      </Flex>
      <Flex className={classes.row}>
        <Button variant="contained">contained</Button>
        <Button variant="contained" color="primary">
          contained primary
        </Button>
        <Button variant="contained" color="secondary">
          contained secondary
        </Button>
      </Flex>
      <Flex className={classes.row}>
        <Button variant="outlined">outlined</Button>
        <Button variant="outlined" color="primary">
          outlined primary
        </Button>
        <Button variant="outlined" color="secondary">
          outlined secondary
        </Button>
      </Flex>
    </Paper>
  );
};

const useStyles = makeStyles({
  row: {
    margin: '24px 0',
    '& > *': {
      marginRight: 16,
    },
  },
});
