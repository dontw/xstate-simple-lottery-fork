import EventEmitter from 'eventemitter3';

const delay = s => new Promise((resolve) => {
  setTimeout(() => { resolve() }, s * 1000)
});

let balance = 50;

export const eventTypes = {
  LOGIN_SUCCEED: 'LOGIN_SUCCEED',
  BET_SUCCEED: 'BET_SUCCEED',
};

export default class MockService extends EventEmitter {
  constructor() {
    super();
    this.login();
  }

  async login() {
    await delay(1);
    this.emit(eventTypes.LOGIN_SUCCEED, { username: 'someone', balance });
  }

  async bet(value) {
    balance -= 10;
    await delay(1);
    let win = Math.random() > .5 ? 10 : 0;
    if (win) balance += 20;
    this.emit(eventTypes.BET_SUCCEED, { win, balance });
  }
}
