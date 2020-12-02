/* eslint-disable react/prop-types */
import React, { ReactChild, useContext, useEffect } from 'react';
import { CoreUtils } from '@core';
import { matchRoutes } from 'react-router-config';
import { useLocation, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AppContext from 'AppContext';
import { RootState } from 'types';

interface Props {
  children: ReactChild;
}

interface LocationState {
  redirectUrl: string;
}

const CoreAuthorization = ({ children }: Props) => {
  const location = useLocation<LocationState>();
  const { pathname } = location;
  const history = useHistory();
  const { routes } = useContext(AppContext);

  const matched = matchRoutes(routes, pathname)[0];
  const userRole = useSelector(({ auth }: RootState) => auth.user.role);

  const accessGranted = matched
    ? CoreUtils.hasPermission(matched.route.auth, userRole)
    : true;
  useEffect(() => {
    if (!accessGranted) {
      const { pathname, state } = location;

      let redirectUrl = state && state.redirectUrl ? state.redirectUrl : '/';
      if (pathname === '/register') redirectUrl = '/';

      /*
            User is guest
            Redirect to Login Page
            */
      if (!userRole || userRole.length === 0) {
        history.push({
          pathname: '/login',
          state: { redirectUrl: pathname },
        });
      } else {
        /*
            User is member
            User must be on unAuthorized page or just logged in
            Redirect to dashboard or redirectUrl
            */
        history.push({
          pathname: redirectUrl,
        });
      }
    }
  }, [accessGranted, location, userRole, history]);

  // console.info('Fuse Authorization rendered', accessGranted);
  return accessGranted ? <React.Fragment>{children}</React.Fragment> : null;
};

export default CoreAuthorization;
