import React, { useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import {
  Icon,
  ListItemIcon,
  ListItemText,
  Popover,
  MenuItem,
} from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import * as authActions from 'store/actions/auth';
import { RootState } from 'types';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
    flexDirection: 'row',
    alignSelf: 'flex-end',
    height: '100%',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
    display: 'none',
  },
}));

export default function Layout() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const user = useSelector(({ auth }: RootState) => auth.user);

  const [userMenu, setUserMenu] = useState(null);

  const userMenuClick = (event: any) => {
    setUserMenu(event.currentTarget);
  };

  const userMenuClose = () => {
    setUserMenu(null);
  };

  return (
    <AppBar
      color="transparent"
      elevation={0}
      position="absolute"
      className={clsx(classes.appBar, classes.appBarShift)}
    >
      <Toolbar className={classes.toolbar}>
        <IconButton color="inherit" onClick={userMenuClick}>
          <AccountCircleIcon fontSize="large" />
        </IconButton>
        <Popover
          open={Boolean(userMenu)}
          anchorEl={userMenu}
          onClose={userMenuClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          classes={{
            paper: 'py-8',
          }}
        >
          {!user.role || user.role.length === 0 ? (
            <React.Fragment></React.Fragment>
          ) : (
            <React.Fragment>
              <MenuItem
                onClick={() => {
                  dispatch(authActions.logoutUser());
                  userMenuClose();
                }}
              >
                <ListItemIcon className="min-w-40">
                  <Icon>exit_to_app</Icon>
                </ListItemIcon>
                <ListItemText className="pl-0" primary="Logout" />
              </MenuItem>
            </React.Fragment>
          )}
        </Popover>
      </Toolbar>
    </AppBar>
  );
}
Layout.propTypes = {
  children: PropTypes.object,
};
