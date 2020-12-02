import React from 'react';
import { Typography } from '@material-ui/core';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: 30,
    paddingBottom: 24,
    '& .logo-icon': {
      width: 48,
      height: 48,
      // transition: theme.transitions.create(['width', 'height'], {
      //   duration: theme.transitions.duration.shortest,
      //   easing: theme.transitions.easing.easeInOut,
      // }),
    },
    '& .react-badge, & .logo-text': {
      // transition: theme.transitions.create('opacity', {
      //   duration: theme.transitions.duration.shortest,
      //   easing: theme.transitions.easing.easeInOut,
      // }),
    },
  },
  logoTypo: {
    fontSize: 18,
    width: 90,
    paddingLeft: 0,
    marginLeft: 10,
    lineHeight: '18px',
    height: 18,
    fontFamily: 'Vaud',
    fontWeight: 800,
  },
  logoTypoSecond: {
    fontSize: 14,
    width: 90,
    paddingLeft: 0,
    marginLeft: 10,
    lineHeight: '14px',
    height: 14,
    fontFamily: 'Vaud',
    marginTop: 3,
    fontWeight: 500,
  },
}));

function Logo() {
  const classes = useStyles();

  return (
    <div className={clsx(classes.root, 'flex items-center pl-8')}>
      <div className="flex flex-col">
        <Typography className={classes.logoTypo} color="textPrimary">
          Restaurnt reviews
        </Typography>
      </div>
    </div>
  );
}

export default Logo;
