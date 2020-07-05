import React, { useState, ChangeEvent } from 'react';
import { makeStyles, styled } from '@material-ui/core/styles';
import { Paper, Input, FormControl, FormLabel, FormControlLabel } from '../src';
import { StoryProps } from './types';

export default {
  title: 'Textfields',
};

export const TextfieldsExample = ({ id, name }: StoryProps) => {
  return (
    <Paper id={id}>
      <h2>{name}</h2>
      <Input defaultValue="default input" placeholder="placehoder" autoFocus />
    </Paper>
  );
};
