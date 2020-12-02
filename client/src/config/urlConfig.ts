const isDev = process.env.NODE_ENV === 'development';
const urlConfig = {
  API_URL: isDev
    ? process.env.REACT_APP_API_BASE_DEV
    : process.env.REACT_APP_API_BASE_PROD,
};

export default urlConfig;
