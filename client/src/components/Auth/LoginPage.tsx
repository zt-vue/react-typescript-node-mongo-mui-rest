import React, { useState, useRef, useEffect, ReactElement } from 'react';
import { Button, Card, CardContent, Typography } from '@material-ui/core';
import { darken } from '@material-ui/core/styles/colorManipulator';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import * as authActions from 'store/actions/auth';
import * as coreActions from 'store/actions/core';
import { InputAdornment, Icon } from '@material-ui/core';
import { TextFieldFormsy } from '@core';
import Formsy from 'formsy-react';
import { RootState } from 'types';

const useStyles = makeStyles((theme: any) => ({
  root: {
    background:
      'radial-gradient(' +
      darken(theme.palette.primary.dark, 0.5) +
      ' 0%, ' +
      theme.palette.primary.dark +
      ' 80%)',
    color: theme.palette.primary.contrastText,
  },
}));

function LoginPage() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const login = useSelector(({ auth }: RootState) => auth.login);
  const [isFormValid, setIsFormValid] = useState(true);
  const formRef = useRef<ReactElement | any>(null);

  useEffect(() => {
    if (login.error) {
      dispatch(coreActions.showMessage({ message: login.error }));
      disableButton();
    }
  }, [login, dispatch]);

  function disableButton() {
    setIsFormValid(false);
  }
  function enableButton() {
    setIsFormValid(true);
  }

  function handleSubmit(model: any) {
    dispatch(authActions.submitLogin(model));
  }

  return (
    <div
      className={clsx(
        classes.root,
        'flex flex-col flex-auto flex-shrink-0 items-center justify-center p-32 h-full'
      )}
    >
      <div className="flex flex-col items-center justify-center w-full">
        <Card className="w-full max-w-384">
          <CardContent className="flex flex-col items-center justify-center p-32">
            <Typography variant="h6" className="mt-16 mb-32">
              LOGIN TO YOUR ACCOUNT
            </Typography>

            <Formsy
              onValidSubmit={handleSubmit}
              onValid={enableButton}
              onInvalid={disableButton}
              ref={formRef}
              className="flex flex-col justify-center w-full"
            >
              <TextFieldFormsy
                className="mb-16"
                name="email"
                label="Email"
                validations="isEmail"
                validationErrors={{
                  isEmail: 'Please enter a valid email',
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Icon className="text-20" color="action">
                        email
                      </Icon>
                    </InputAdornment>
                  ),
                }}
                variant="outlined"
                required
              />

              <TextFieldFormsy
                className="mb-16"
                type="password"
                name="password"
                label="Password"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Icon className="text-20" color="action">
                        vpn_key
                      </Icon>
                    </InputAdornment>
                  ),
                }}
                variant="outlined"
                required
              />

              <Button
                type="submit"
                variant="contained"
                color="primary"
                className="w-full mx-auto mt-16 normal-case"
                aria-label="LOG IN"
                disabled={!isFormValid}
                value="legacy"
              >
                Login
              </Button>
            </Formsy>
            <div className="flex flex-col items-center justify-center pt-32 pb-24">
              <span className="font-medium">{"Don't have an account?"}</span>
              <Link className="font-medium" to="/register">
                Create an account
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default LoginPage;
