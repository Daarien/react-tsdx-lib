import React, { useState, ChangeEvent } from 'react';
import { Grid, Box, Typography, MenuItem } from '@material-ui/core';
import { makeStyles, styled } from '@material-ui/core/styles';
import { Paper, Input, TextField } from '../src';
import { StoryProps } from './types';

export default {
  title: 'TextFields',
};

enum Option {
  road = 'road',
  tree = 'tree',
  mountain = 'mountain',
}

export const TextFieldsExample = ({ id, name }: StoryProps) => {
  const [value, setValue] = useState('Contolled TextField');
  const [option, setOption] = useState(Option.road);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setValue(e.target.value);
  }

  function handleSelect(e: ChangeEvent<HTMLInputElement>) {
    const { value, name } = e.target;
    setOption(value as Option);
  }

  return (
    <Paper id={id}>
      <Typography variant="h4">{name}</Typography>
      <Canvas>
        <Grid container>
          <Box m={3}>
            <Input defaultValue="default input" placeholder="placehoder" autoFocus />
          </Box>
          <Box m={3}>
            <Input defaultValue="outlined input" placeholder="placehoder" variant="outlined" />
          </Box>
        </Grid>
        <Grid container>
          <Box m={3}>
            <TextField
              label="TextField label"
              helperText="helper text"
              placeholder="placeholer"
              variant="outlined"
            />
          </Box>
          <Box m={3}>
            <TextField
              label="TextField label"
              helperText="helper text"
              placeholder="placeholer"
              value="error state"
              variant="outlined"
              error
            />
          </Box>
          <Box m={3}>
            <TextField
              label="TextField label"
              helperText="helper text"
              placeholder="placeholer"
              value="disabled state"
              variant="outlined"
              disabled
            />
          </Box>
        </Grid>
        <Grid container>
          <Grid item xs={4}>
            <Box m={3}>
              <TextField fullWidth value="full width" label="label" />
            </Box>
          </Grid>
          <Grid item xs={2}>
            <Box m={3}>
              <TextField
                label="Controlled TextField"
                helperText="helper text"
                placeholder="placeholer"
                variant="outlined"
                value={value}
                onChange={handleChange}
              />
            </Box>
          </Grid>
        </Grid>
        <Grid container>
          <Grid item xs={3}>
            <Box m={3}>
              <TextField
                select
                label="Selectable TextField"
                value={option}
                onChange={handleSelect}
                helperText="TextField with options"
              >
                <MenuItem value={Option.road}>{Option.road}</MenuItem>
                <MenuItem value={Option.tree}>{Option.tree}</MenuItem>
                <MenuItem value={Option.mountain}>{Option.mountain}</MenuItem>
              </TextField>
            </Box>
          </Grid>
        </Grid>
      </Canvas>
    </Paper>
  );
};

const Canvas = styled('div')(({ theme }) => ({
  padding: theme.spacing(3, 3),
  backgroundColor: '#E5E5E5',
}));
