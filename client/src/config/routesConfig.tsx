/* eslint-disable react/display-name */
import React from 'react';
import { Redirect } from 'react-router-dom';
import authRoles from 'providers/authRoles';
import { RouteConfig } from 'react-router-config';

const routes: RouteConfig[] = [
  {
    path: '/login',
    auth: authRoles.onlyGuest,
    component: React.lazy(() => import('components/Auth/LoginPage')),
  },
  {
    path: '/register',
    auth: authRoles.onlyGuest,
    component: React.lazy(() => import('components/Auth/RegisterPage')),
  },
  {
    path: '/',
    exact: true,
    auth: authRoles.user,
    component: React.lazy(
      () => import('components/Restaurants/RestaurantsPage')
    ),
  },
  {
    path: '/users',
    exact: true,
    auth: authRoles.admin,
    component: React.lazy(() => import('components/Users/UsersPage')),
  },
  {
    path: '/profile',
    exact: true,
    auth: authRoles.user,
    component: React.lazy(() => import('components/Profile/ProfilePage')),
  },
  {
    component: () => <Redirect to="/" />,
  },
];

export default routes;
