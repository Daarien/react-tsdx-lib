import React, { useState, ChangeEvent, HTMLAttributes } from 'react';
import { Paper, ButtonTabs, ButtonTab } from '../src';
import { Box, Typography } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { StoryProps } from './types';

export default {
  title: 'Tabs',
};

const useStyles = makeStyles(theme =>
  createStyles({
    paper: {
      backgroundColor: theme.palette.grey[100],
    },
  })
);

export const ButtonTabsExample = ({ id, name }: StoryProps) => {
  const classes = useStyles();
  const [tab, setActiveTab] = useState(0);

  function handleChangeTab(e: ChangeEvent<unknown>, value: number) {
    setActiveTab(value);
  }

  return (
    <Paper id={id} className={classes.paper}>
      <h2>{name}</h2>
      <ButtonTabs value={tab} onChange={handleChangeTab}>
        <ButtonTab value={0} label="Tab 1" />
        <ButtonTab value={1} label="Tab 2" />
        <ButtonTab value={2} label="Tab 3" />
      </ButtonTabs>
      <TabPanel value={tab} index={0}>
        Item One
      </TabPanel>
      <TabPanel value={tab} index={1}>
        Item Two
      </TabPanel>
      <TabPanel value={tab} index={2}>
        Item Three
      </TabPanel>
    </Paper>
  );
};

interface TabPanelProps extends HTMLAttributes<HTMLDivElement> {
  value: any;
  index: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}
