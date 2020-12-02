import React, { useEffect, useRef, useState } from 'react';
import { Button, Card, CardContent, Typography } from '@material-ui/core';
import { InputAdornment, Icon } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'types';
import Formsy from 'formsy-react';
import { TextFieldFormsy, CheckboxFormsy } from '@core';
import * as authActions from 'store/actions/auth';
import * as coreActions from 'store/actions/core';

const useStyles = makeStyles((theme: any) => ({
  root: {},
}));

function RegisterPage() {
  const classes = useStyles();

  const user = useSelector(({ auth }: RootState) => auth.user);
  const dispatch = useDispatch();
  const profile = useSelector(({ auth }: RootState) => auth.profile);

  const [isFormValid, setIsFormValid] = useState(false);
  const [isUpdatePassword, setIsUpdatePassword] = useState(false);
  const formRef = useRef<any>(null);

  useEffect(() => {
    if (profile.error) {
      dispatch(coreActions.showMessage({ message: profile.error }));
      disableButton();
    }
  }, [profile, dispatch]);

  function disableButton() {
    setIsFormValid(false);
  }

  function enableButton() {
    setIsFormValid(true);
  }

  function handleSubmit(model: any) {
    dispatch(authActions.profileUpdate(model));
  }
  return (
    <div
      className={clsx(
        classes.root,
        'flex flex-col flex-auto flex-shrink-0 p-10 h-full'
      )}
    >
      <Typography variant="h4" className="mt-16 mb-32">
        Profile Page
      </Typography>
      <div className="flex flex-col items-center justify-center w-full">
        <Card className="w-full max-w-384" variant="elevation" elevation={0}>
          <CardContent className="flex flex-col items-center justify-center p-32">
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
                value={user.name}
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
                value={user.email}
                variant="outlined"
                required
              />
              <CheckboxFormsy
                className="mb-16"
                label="Update password"
                name="isUpdatePassword"
                value={false}
                onChange={(e: any) => setIsUpdatePassword(e.target.checked)}
              />
              {isUpdatePassword && (
                <>
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
                  />{' '}
                </>
              )}
              <Button
                type="submit"
                variant="contained"
                color="primary"
                className="w-full mx-auto mt-16 normal-case"
                aria-label="Update"
                disabled={!isFormValid}
                value="legacy"
              >
                Update
              </Button>
            </Formsy>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default RegisterPage;
