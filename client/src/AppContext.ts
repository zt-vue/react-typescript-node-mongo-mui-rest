import React from 'react';
import { RouteConfig } from 'react-router-config';
type ContextProps = {
  routes: RouteConfig[];
};
const AppContext = React.createContext<ContextProps>({ routes: [] });

export default AppContext;
