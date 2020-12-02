import React from 'react';
import { Snackbar, IconButton, Icon, SnackbarContent } from '@material-ui/core';
import { green, amber, blue } from '@material-ui/core/colors';
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';
import * as Actions from 'store/actions/core';
import { makeStyles } from '@material-ui/styles';
import { RootState } from 'types';

const useStyles: any = makeStyles((theme: any) => ({
  root: {},
  success: {
    backgroundColor: green[600],
    color: '#FFFFFF',
  },
  error: {
    backgroundColor: theme.palette.error.dark,
    color: theme.palette.getContrastText(theme.palette.error.dark),
  },
  info: {
    backgroundColor: blue[600],
    color: '#FFFFFF',
  },
  warning: {
    backgroundColor: amber[600],
    color: '#FFFFFF',
  },
}));

const variantIcon: any = {
  success: 'check_circle',
  warning: 'warning',
  error: 'error_outline',
  info: 'info',
};

function CoreMessage() {
  const dispatch = useDispatch();
  const state = useSelector(({ core }: RootState) => core.message.state);
  const options = useSelector(({ core }: RootState) => core.message.options);

  const classes = useStyles();

  return (
    <Snackbar
      {...options}
      open={state}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      onClose={() => dispatch(Actions.hideMessage())}
      classes={{
        root: classes.root,
      }}
      ContentProps={{
        variant: 'outlined',
        // headlineMapping: {
        //   body1: 'div',
        //   body2: 'div',
        // },
      }}
    >
      <SnackbarContent
        className={clsx(classes[options.variant])}
        message={
          <div className="flex items-center">
            {variantIcon[options.variant] && (
              <Icon className="mr-8" color="inherit">
                {variantIcon[options.variant]}
              </Icon>
            )}
            {options.message}
          </div>
        }
        action={[
          <IconButton
            key="close"
            aria-label="Close"
            color="inherit"
            onClick={() => dispatch(Actions.hideMessage())}
          >
            <Icon>close</Icon>
          </IconButton>,
        ]}
      />
    </Snackbar>
  );
}

export default React.memo(CoreMessage);
