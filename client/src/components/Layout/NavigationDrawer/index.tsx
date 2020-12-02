import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import MainListItems from './MainlistItems';
import Logo from './Logo';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
    type: 'dark',
  },
});
const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    background: '#2f2f2f',
    width: drawerWidth,
    minHeight: '100%',
    height: 'auto',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  toolbar: theme.mixins.toolbar,
}));

export default function NavigationDrawer() {
  const classes = useStyles();

  return (
    <ThemeProvider theme={theme}>
      <Drawer
        variant="permanent"
        classes={{
          paper: clsx(classes.drawerPaper),
        }}
      >
        <div className={classes.toolbar}>
          <Logo />
        </div>
        <div className="flex flex-col justify-between flex-grow pb-10">
          <List>
            <MainListItems />
          </List>
        </div>
      </Drawer>
    </ThemeProvider>
  );
}
