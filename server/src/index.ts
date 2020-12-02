import app from './app';
import config from './config';

// Start the server on the correct port
const server = app.listen(config.port, () => {
  // console.log('🚀server started: ', config.port);
});
