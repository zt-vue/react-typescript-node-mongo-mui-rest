import React from 'react';
import { create } from 'jss';
import jssExtend from 'jss-plugin-extend';
import { Router } from 'react-router-dom';
import {
  StylesProvider,
  jssPreset,
  createGenerateClassName,
} from '@material-ui/styles';
import { ThemeProvider } from '@material-ui/core/styles';
import { themeConfig } from 'config';
import history from '@history';
import store from 'store';
import { Provider } from 'react-redux';
import routes from 'config/routesConfig';
import AppContext from 'AppContext';
import Auth from 'providers/Auth';
import { CoreMessage, CoreAuthorization } from '@core';
import MainLayout from 'components/Layout/MainLayout';

const jss = create({
  ...jssPreset(),
  plugins: [...jssPreset().plugins, jssExtend()],
  insertionPoint: document.getElementById('jss-insertion-point') || undefined,
});
const generateClassName = createGenerateClassName();
const App = () => {
  return (
    <AppContext.Provider
      value={{
        routes,
      }}
    >
      <StylesProvider jss={jss} generateClassName={generateClassName}>
        <Provider store={store}>
          <Auth>
            <ThemeProvider theme={themeConfig}>
              <Router history={history}>
                <CoreAuthorization>
                  <MainLayout />
                </CoreAuthorization>
              </Router>
              <CoreMessage />
            </ThemeProvider>
          </Auth>
        </Provider>
      </StylesProvider>
    </AppContext.Provider>
  );
};
export default App;
