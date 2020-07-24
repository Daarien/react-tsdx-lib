import React, { useState, ChangeEvent, HTMLAttributes } from 'react';
import { Paper, Select, FormControl, FormLabel, FormHelperText } from '../src';
import { Box, Typography, MenuItem, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { StoryProps } from './types';

export default {
  title: 'Select',
};

const useStyles = makeStyles(theme => ({
  paper: {
    backgroundColor: theme.palette.grey[100],
  },
}));

enum Option {
  '' = '',
  road = 'road',
  tree = 'tree',
  mountain = 'mountain',
}

const options = [
  <MenuItem key={Option.road} value={Option.road}>
    {Option.road}
  </MenuItem>,
  <MenuItem key={Option.tree} value={Option.tree}>
    {Option.tree}
  </MenuItem>,
  <MenuItem key={Option.mountain} value={Option.mountain}>
    {Option.mountain}
  </MenuItem>,
];

export const SelectExample = ({ id, name }: StoryProps) => {
  const classes = useStyles();
  const [option, setOption] = useState('');

  function handleSelect(e: ChangeEvent<HTMLInputElement>) {
    setOption(e.target.value as Option);
  }

  return (
    <Paper id={id} className={classes.paper}>
      <h2>{name}</h2>
      {/* <Grid container>
        <Box m={2}>
          <Select
            labelId="demo-select-label"
            id="demo-select"
            value={option}
            onChange={handleSelect}
          >
            {options}
          </Select>
        </Box>
        <Box m={2}>
          <Select id="demo-select" variant="outlined" value={option} onChange={handleSelect}>
            {options}
          </Select>
        </Box>
      </Grid> */}
      <Grid container>
        <Box m={2}>
          <FormControl>
            <FormLabel htmlFor={'simple-select-1'} id="select-label-1">
              Select label
            </FormLabel>
            <Select id="simple-select-1" value={option} onChange={handleSelect}>
              {options}
            </Select>
            <FormHelperText>Some important helper text</FormHelperText>
          </FormControl>
        </Box>
        {/* <Box m={2}>
          <FormControl>
            <InputLabel id="select-label-2">Select label</InputLabel>
            <Select
              labelId="select-label-2"
              id="simple-select-2"
              value={option}
              onChange={handleSelect}
              variant="outlined"
              displayEmpty
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {options}
            </Select>
            <FormHelperText>Some important helper text</FormHelperText>
          </FormControl>
        </Box> */}
      </Grid>
    </Paper>
  );
};
