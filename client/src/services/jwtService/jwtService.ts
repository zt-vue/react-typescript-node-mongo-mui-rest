import axios from '../axiosService';
import jwtDecode from 'jwt-decode';
import CoreUtils from '@core/CoreUtils';

class jwtService extends CoreUtils.EventEmitter {
  init() {
    this.setInterceptors();
    this.handleAuthentication();
  }

  setInterceptors = () => {
    axios.interceptors.response.use(
      (response) => {
        return response;
      },
      (err) => {
        return new Promise((resolve, reject) => {
          if (
            err.response.status === 401 &&
            err.config &&
            !err.config.__isRetryRequest
          ) {
            // if you ever get an unauthorized response, logout the user
            this.emit('onAutoLogout', 'Invalid access_token');
            this.setSession();
          }
          throw err;
        });
      }
    );
  };

  handleAuthentication = () => {
    let access_token = this.getAccessToken();

    if (!access_token) {
      this.emit('onNoAccessToken');

      return;
    }

    if (this.isAuthTokenValid(access_token)) {
      this.setSession(access_token);
      this.emit('onAutoLogin', true);
    } else {
      this.setSession();
      this.emit('onAutoLogout', 'access_token expired');
    }
  };

  createUser = (data: any) => {
    return new Promise((resolve, reject) => {
      axios
        .post('/api/auth/register', data)
        .then((response) => {
          if (response.data.user) {
            this.setSession(response.data.access_token);
            resolve(response.data.user);
          }
        })
        .catch(({ response }) => {
          reject(response.data.message);
        });
    });
  };

  updateProfile = (data: any) => {
    return new Promise((resolve, reject) => {
      axios
        .post('/api/auth/profile', data)
        .then((response) => {
          if (response.data.user) {
            this.setSession(response.data.access_token);
            resolve(response.data.user);
          }
        })
        .catch(({ response }) => {
          reject(response.data.message);
        });
    });
  };

  signInWithEmailAndPassword = (email: string, password: string) => {
    return new Promise((resolve, reject) => {
      axios
        .post('/api/auth/login', {
          email,
          password,
        })
        .then((response) => {
          if (response.data.user) {
            this.setSession(response.data.access_token);
            resolve(response.data.user);
          }
        })
        .catch(({ response }) => {
          if (!response) reject();
          else if (!response.data) reject(response);
          else reject(response.data.message);
        });
    });
  };

  signInWithToken = () => {
    return new Promise((resolve, reject) => {
      axios
        .get('/api/auth/access-token', {
          data: {
            access_token: this.getAccessToken(),
          },
        })
        .then((response) => {
          if (response.data.user) {
            this.setSession(response.data.access_token);
            resolve(response.data.user);
          } else {
            this.logout();
            reject('Failed to login with token.');
          }
        })
        .catch((error) => {
          this.logout();
          reject('Failed to login with token.');
        });
    });
  };

  updateUserData = (user: any) => {
    return axios.post('/api/auth/user/update', {
      user: user,
    });
  };

  setSession = (access_token?: string) => {
    if (access_token) {
      localStorage.setItem('jwt_access_token', access_token);
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + access_token;
    } else {
      localStorage.removeItem('jwt_access_token');
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  logout = () => {
    this.setSession();
  };

  isAuthTokenValid = (access_token: string) => {
    if (!access_token) {
      return false;
    }
    const decoded: any = jwtDecode(access_token);
    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) {
      console.warn('access token expired');
      return false;
    } else {
      return true;
    }
  };

  getAccessToken = () => {
    return window.localStorage.getItem('jwt_access_token');
  };
}

const instance = new jwtService();

export default instance;
