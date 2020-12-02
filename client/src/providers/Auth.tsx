import React, { useState, ReactChild, useRef } from 'react';
import { CoreSplashScreen } from '@core';
import * as userActions from 'store/actions/auth';
import * as Actions from 'store/actions/core';
import jwtService from 'services/jwtService';
import { useDispatch } from 'react-redux';

interface Props {
  children: ReactChild;
}

const Auth = ({ children }: Props) => {
  const [waitAuthCheck, setWaitAuthCheck] = useState(true);
  const dispatch = useDispatch();

  const ref = useRef(true);

  const jwtCheck = () =>
    new Promise((resolve) => {
      jwtService.on('onAutoLogin', () => {
        dispatch(Actions.showMessage({ message: 'Logging in with JWT' }));

        /**
         * Sign in and retrieve user data from Api
         */
        jwtService
          .signInWithToken()
          .then((user: any) => {
            dispatch(userActions.setUserData(user));

            resolve();

            dispatch(Actions.showMessage({ message: 'Logged in with JWT' }));
          })
          .catch((error) => {
            dispatch(Actions.showMessage({ message: error }));

            resolve();
          });
      });

      jwtService.on('onAutoLogout', (message: string) => {
        if (message) {
          dispatch(Actions.showMessage({ message }));
        }

        dispatch(userActions.logoutUser());

        resolve();
      });

      jwtService.on('onNoAccessToken', () => {
        resolve();
      });

      jwtService.init();

      return Promise.resolve();
    });

  if (ref.current) {
    jwtCheck().then(() => {
      setWaitAuthCheck(false);
    });
    ref.current = false;
  }

  return waitAuthCheck ? (
    <CoreSplashScreen />
  ) : (
    <React.Fragment children={children} />
  );
};

export default Auth;
