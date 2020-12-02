import React from 'react';
import Icon from '@material-ui/core/Icon';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/styles';
import { NavLink } from 'react-router-dom';
import clsx from 'clsx';
import { useSelector } from 'react-redux';
import { RootState } from 'types';

const useStyles = makeStyles((theme: any) => ({
  item: {
    height: 40,
    width: 'calc(100% - 16px)',
    borderRadius: '0 20px 20px 0',
    paddingRight: 12,
    '&.active': {
      backgroundColor: theme.palette.secondary.main,
      color: theme.palette.secondary.contrastText + '!important',
      pointerEvents: 'none',
      transition: 'border-radius .15s cubic-bezier(0.4,0.0,0.2,1)',
      '& .list-item-text-primary': {
        color: 'inherit',
      },
      '& .list-item-icon': {
        color: 'inherit',
      },
    },
    '&.square, &.active.square': {
      width: '100%',
      borderRadius: '0',
    },
    '& .list-item-icon': {},
    '& .list-item-text': {},
    color: theme.palette.text.primary,
    cursor: 'pointer',
    textDecoration: 'none!important',
  },
}));

const MainListItems = () => {
  const classes = useStyles();
  const user = useSelector(({ auth }: RootState) => auth.user);

  return (
    <>
      <ListItem
        button
        to="/"
        component={NavLink}
        className={clsx(classes.item)}
        exact={true}
      >
        <Icon
          className="list-item-icon text-16 flex-shrink-0 mr-16"
          color="action"
        >
          restaurant
        </Icon>
        <ListItemText primary="Restaurant" classes={{ primary: 'font-600' }} />
      </ListItem>
      {user.role === 'admin' && (
        <ListItem
          button
          to="/users"
          component={NavLink}
          className={classes.item}
        >
          <Icon
            className="list-item-icon text-16 flex-shrink-0 mr-16"
            color="action"
          >
            person
          </Icon>
          <ListItemText primary="User" classes={{ primary: 'font-600' }} />
        </ListItem>
      )}
      <ListItem
        button
        to="/profile"
        component={NavLink}
        className={classes.item}
      >
        <Icon
          className="list-item-icon text-16 flex-shrink-0 mr-16"
          color="action"
        >
          settings
        </Icon>
        <ListItemText primary="Profile" classes={{ primary: 'font-600' }} />
      </ListItem>
    </>
  );
};
export default MainListItems;
