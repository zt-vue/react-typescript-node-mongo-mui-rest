import React, { useEffect, useRef, useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  Typography,
  MenuItem,
} from '@material-ui/core';
import { InputAdornment, Icon } from '@material-ui/core';
import { darken } from '@material-ui/core/styles/colorManipulator';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import { Link } from 'react-router-dom';
import Formsy from 'formsy-react';
import { TextFieldFormsy, SelectFormsy } from '@core';
import * as authActions from 'store/actions/auth';
import * as coreActions from 'store/actions/core';
import { useDispatch, useSelector } from 'react-redux';
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

function RegisterPage() {
  const classes = useStyles();

  const dispatch = useDispatch();
  const register = useSelector(({ auth }: RootState) => auth.register);

  const [isFormValid, setIsFormValid] = useState(false);
  const formRef = useRef<any>(null);

  useEffect(() => {
    if (register.error) {
      dispatch(coreActions.showMessage({ message: register.error }));
      disableButton();
    }
  }, [register, dispatch]);

  function disableButton() {
    setIsFormValid(false);
  }

  function enableButton() {
    setIsFormValid(true);
  }

  function handleSubmit(model: any) {
    dispatch(authActions.submitRegister(model));
  }

  return (
    <div
      className={clsx(
        classes.root,
        'flex flex-col flex-auto flex-shrink-0 items-center justify-center p-10 h-full'
      )}
    >
      <div className="flex flex-col items-center justify-center w-full">
        <Card className="w-full max-w-384">
          <CardContent className="flex flex-col items-center justify-center p-32">
            <Typography variant="h6" className="mt-16 mb-32">
              CREATE AN ACCOUNT
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
                type="text"
                name="name"
                label="Name"
                validations={{
                  minLength: 4,
                }}
                validationErrors={{
                  minLength: 'Min character length is 4',
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Icon className="text-20" color="action">
                        person
                      </Icon>
                    </InputAdornment>
                  ),
                }}
                variant="outlined"
                required
              />

              <TextFieldFormsy
                className="mb-16"
                type="text"
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

              <SelectFormsy
                className="mb-16"
                name="role"
                label="Role"
                variant="outlined"
                value="regular"
                required
              >
                <MenuItem value="owner">Owner</MenuItem>
                <MenuItem value="regular">Regular</MenuItem>
              </SelectFormsy>

              <TextFieldFormsy
                className="mb-16"
                type="password"
                name="password"
                label="Password"
                validations="equalsField:password-confirm"
                validationErrors={{
                  equalsField: 'Passwords do not match',
                }}
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

              <TextFieldFormsy
                className="mb-16"
                type="password"
                name="password-confirm"
                label="Confirm Password"
                validations="equalsField:password"
                validationErrors={{
                  equalsField: 'Passwords do not match',
                }}
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
                aria-label="REGISTER"
                disabled={!isFormValid}
                value="legacy"
              >
                Register
              </Button>
            </Formsy>

            <div className="flex flex-col items-center justify-center pt-32 pb-24">
              <span className="font-medium">Already have an account?</span>
              <Link className="font-medium" to="/login">
                Login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default RegisterPage;
