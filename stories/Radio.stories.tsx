import React, { useState, ChangeEvent } from 'react';
import { makeStyles, styled } from '@material-ui/core/styles';
import { Paper, Radio, RadioGroup, FormControl, FormLabel, FormControlLabel } from '../src';
import { StoryProps } from './types';

export default {
  title: 'Radio',
};

// By passing optional props to this story, you can control the props of the component when
// you consume the story in a test.
export const RadioExample = ({ id, name }: StoryProps) => {
  const classes = useStyles();

  const [value, setValue] = React.useState('macos');

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  function handleFormControlEventBubbling(e: ChangeEvent<HTMLInputElement>) {
    console.log('handleFormControlEventBubbling -> e.target.value', e.target.value);
  }

  return (
    <Paper id={id}>
      <h2>{name}</h2>
      <FormControl component="fieldset" onChange={handleFormControlEventBubbling}>
        <FormLabel component="legend">Choose OS</FormLabel>
        <RadioGroup aria-label="gender" name="os" value={value} onChange={handleChange}>
          <FormControlLabel value="macos" control={<Radio />} label="Mac OS" />
          <FormControlLabel value="windows" control={<Radio />} label="Windows" />
          <FormControlLabel value="other" control={<Radio />} label="Other" />
          <FormControlLabel value="dos" disabled control={<Radio />} label="(Disabled option)" />
        </RadioGroup>
      </FormControl>
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
