import { Machine, interpret, assign } from 'xstate';
import SockerService, { eventTypes as socketEventTypes } from './../services/MockService';

export const states = {
  UNINITIALIZED: 'UNINITIALIZED',
  IDLE: 'IDLE',
  //  idle nested state
  NORMAL: 'NORMAL',
  BET_NOT_ENOUGH: 'BET_NOT_ENOUGH',
  PLAYING: 'PLAYING',
  // playing nested state
  BET_REQUESTING: 'BET_REQUESTING',
  TRANSITION_EFFECTS_PLAYING: 'TRANSITION_EFFECTS_PLAYING',
  WIN_EFFECTS_PLAYING: 'WIN_EFFECTS_PLAYING',
};

export const eventTypes = {
  LOGIN_SUCCEED: 'LOGIN_SUCCEED',
  IDLE: 'IDLE',
  PLAY: 'PLAY',
  PLAY_TRANSITION_EFFECTS: 'PLAY_TRANSITION_EFFECTS',
  PLAY_WIN_EFFECTS: 'PLAY_WIN_EFFECTS',
};

const actions = {
  updateUserLoginData: assign({
    username: (ctx, event) => (event.username),
    balance: (ctx, event) => (event.balance),
  }),

  userBet: assign({
    balance: (ctx, event) => ctx.balance - event.bet,
  }),

  updateUserWinData: assign({
    win: (ctx, event) => event.win,
    balance: (ctx, event) => event.balance,
  }),

  resetWin: assign({
    win: (ctx, event) => 0,
  }),
};

const guards = {
  isBalanceEnough: (ctx, event) => ctx.balance >= event.bet,
};

const machine = Machine({
  id: 'lotteryMachine',
  initial: states.UNINITIALIZED,
  context: {
    username: '',
    balance: 0,
    win: 0,
    socketService: new SockerService(),
  },
  invoke: {
    id: 'login',
    src: (ctx, event) => (callback) => {
      const socketService = ctx.socketService;
      const onLoginSucceed = ({ username, balance }) => {
        callback({ type: eventTypes.LOGIN_SUCCEED, username, balance });
      }
      socketService.on(socketEventTypes.LOGIN_SUCCEED, onLoginSucceed);

      const onBetSucceed = ({ win, balance }) => {
        callback({ type: eventTypes.PLAY_TRANSITION_EFFECTS, win, balance });
      }
      socketService.on(socketEventTypes.BET_SUCCEED, onBetSucceed);

      return () => {
        socketService.removeListener(socketEventTypes.BET_SUCCEED, onBetSucceed);
        socketService.removeListener(socketEventTypes.LOGIN_SUCCEED, onLoginSucceed);
      }
    }
  },
  states: {
    [states.UNINITIALIZED]: {
      on: {
        [eventTypes.LOGIN_SUCCEED]: {
          target: states.IDLE,
          actions: ['updateUserLoginData'],
        },
      }
    },
    [states.IDLE]: {
      id: 'idle',
      initial: states.NORMAL,
      states: {
        [states.NORMAL]: {
          on: {
            [eventTypes.PLAY]: [
              {
                target: '#playing',
                cond: 'isBalanceEnough',
                actions: ['userBet'],
              },
              {
                target: 'BET_NOT_ENOUGH',
              }
            ],
          }
        },
        [states.BET_NOT_ENOUGH]: {
          on: {
            [eventTypes.IDLE]: states.NORMAL,
          }
        },
      }
    },
    [states.PLAYING]: {
      id: 'playing',
      initial: states.BET_REQUESTING,
      states: {
        [states.BET_REQUESTING]: {
          invoke: {
            id: 'requestBet',
            src: (ctx, event) => (callback) => {
              const socketService = ctx.socketService;
              socketService.bet(event.bet);
              return () => { };
            },
          },
          on: {
            [eventTypes.PLAY_TRANSITION_EFFECTS]: {
              target: states.TRANSITION_EFFECTS_PLAYING,
              actions: 'updateUserWinData',
            },
          }
        },
        [states.TRANSITION_EFFECTS_PLAYING]: {
          on: {
            [eventTypes.IDLE]: '#idle',
            [eventTypes.PLAY_WIN_EFFECTS]: states.WIN_EFFECTS_PLAYING,
          }
        },
        [states.WIN_EFFECTS_PLAYING]: {
          on: {
            [eventTypes.IDLE]: {
              target: '#idle',
              actions: ['resetWin'],
            },
          }
        },
      }
    },
  }
}, {
  actions,
  guards,
});

export const service = interpret(machine).start();
