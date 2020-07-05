import React, { useState, ChangeEvent } from 'react';
import { makeStyles, styled } from '@material-ui/core/styles';
import { Paper, Checkbox } from '../src';
import { StoryProps } from './types';

export default {
  title: 'Checkbox',
};

// By passing optional props to this story, you can control the props of the component when
// you consume the story in a test.
export const CheckboxExample = ({ id, name }: StoryProps) => {
  const classes = useStyles();

  const [checkboxState, setCheckboxState] = useState(false);
  function handleCheckboxChange(e: ChangeEvent<HTMLInputElement>) {
    const { checked } = e.target;
    setCheckboxState(checked);
  }

  return (
    <Paper id={id}>
      <h2>{name}</h2>
      <section>
        <Box>
          <label htmlFor="check-1">Uncontrolled checkbox</label>
          <Checkbox id="check-1" />
        </Box>
        <Box>
          <label htmlFor="check-2">Checkbox with default check</label>
          <Checkbox id="check-2" defaultChecked />
        </Box>
        <Box>
          <label htmlFor="check-3">Contolled checkbox</label>
          <Checkbox id="check-3" checked={checkboxState} onChange={handleCheckboxChange} />
        </Box>
      </section>
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

const Box = styled('div')({
  display: 'inline-flex',
  alignItems: 'center',
  marginRight: 24,
  '& > label': {
    marginRight: 8,
  },
});
