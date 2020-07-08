import React, { useState, ChangeEvent } from 'react';
import { Grid, Box, Typography } from '@material-ui/core';
import { makeStyles, styled } from '@material-ui/core/styles';
import { Paper, Input, TextField } from '../src';
import { StoryProps } from './types';

export default {
  title: 'Textfields',
};

export const TextfieldsExample = ({ id, name }: StoryProps) => {
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
              label="Textfield label"
              helperText="helper text"
              placeholder="placeholer"
              variant="outlined"
            />
          </Box>
          <Box m={3}>
            <TextField
              label="Textfield label"
              helperText="helper text"
              placeholder="placeholer"
              value="error state"
              variant="outlined"
              error
            />
          </Box>
          <Box m={3}>
            <TextField
              label="Textfield label"
              helperText="helper text"
              placeholder="placeholer"
              value="disabled state"
              variant="outlined"
              disabled
            />
          </Box>
        </Grid>
        <Grid container>
          <Grid item xs={6}>
            <Box m={3}>
              <TextField fullWidth value="full width" label="label" />
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
