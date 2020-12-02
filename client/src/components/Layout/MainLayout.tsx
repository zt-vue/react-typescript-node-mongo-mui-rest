import React, { useContext } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import NavigationDrawer from './NavigationDrawer';
import Container from '@material-ui/core/Container';
import AppBar from './Shared/AppBar';
import { CoreSuspense } from '@core';
import { renderRoutes } from 'react-router-config';
import AppContext from 'AppContext';
import { useSelector } from 'react-redux';
import { RootState } from 'types';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    overflow: 'auto',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    paddingTop: 64,
  },
}));

export default function MainLayout() {
  const classes = useStyles();
  const appContext = useContext(AppContext);
  const { routes } = appContext;
  const role = useSelector(({ auth }: RootState) => auth.user.role);

  return role.length ? (
    <div className={clsx(classes.root, 'h-full')}>
      <CssBaseline />
      <AppBar />
      <NavigationDrawer />
      <main className={clsx(classes.content)}>
        <Container maxWidth="xl" className={clsx(classes.container, 'px-20')}>
          <CoreSuspense delay={1000}>{renderRoutes(routes)}</CoreSuspense>
        </Container>
      </main>
    </div>
  ) : (
    <CoreSuspense delay={1000}>{renderRoutes(routes)}</CoreSuspense>
  );
}
