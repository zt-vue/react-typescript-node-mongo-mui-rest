class EventEmitter {
  events: any;

  constructor() {
    this.events = {};
  }

  _getEventListByName(eventName: string) {
    if (typeof this.events[eventName] === 'undefined') {
      this.events[eventName] = new Set();
    }
    return this.events[eventName];
  }

  on(eventName: string, fn: Function) {
    this._getEventListByName(eventName).add(fn);
  }

  once(eventName: string, fn: Function) {
    const self = this;

    const onceFn = function (...args: any) {
      self.removeListener(eventName, onceFn);
      fn.apply(self, args);
    };
    this.on(eventName, onceFn);
  }

  emit(eventName: string, ...args: any) {
    const that = this;
    this._getEventListByName(eventName).forEach(function (fn: Function) {
      fn.apply(that, args);
    });
  }

  removeListener(eventName: string, fn: Function) {
    this._getEventListByName(eventName).delete(fn);
  }
}

class CoreUtils {
  static generateGUID() {
    function S4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }

    return S4() + S4();
  }

  static EventEmitter = EventEmitter;

  static hasPermission(authArr: string[], userRole: string[] | string) {
    /**
     * If auth array is not defined
     * Pass and allow
     */
    if (authArr === null || authArr === undefined) {
      // console.info("auth is null || undefined:", authArr);
      return true;
    } else if (authArr.length === 0) {
      /**
       * if auth array is empty means,
       * allow only user role is guest (null or empty[])
       */
      // console.info("auth is empty[]:", authArr);
      return !userRole || userRole.length === 0;
    } else {
      /**
       * Check if user has grants
       */
      // console.info("auth arr:", authArr);
      /*
            Check if user role is array,
            */
      if (userRole && Array.isArray(userRole)) {
        return authArr.some((r) => userRole.indexOf(r) >= 0);
      }

      /*
            Check if user role is string,
            */
      return authArr.includes(userRole);
    }
  }
}

export default CoreUtils;
