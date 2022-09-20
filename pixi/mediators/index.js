import { service, states, eventTypes } from './../../fsm/LotteryMachine';

export function createMediators(mainUI) {
  const clearBetButtonMediator = createBetButtonMediator(mainUI.betButton);
  const clearUserPanelMediator = createUserPanelMediator(mainUI.userPanel);
  const clearMessageMediator = createMessageMediator(mainUI.message);
  const clearWinLabelMediator = createWinLabelMediator(mainUI.winLabel);
  return () => {
    clearBetButtonMediator();
    clearUserPanelMediator();
    clearMessageMediator();
    clearWinLabelMediator();
  }
}

function createBetButtonMediator(betButton) {
  const { initialState, send } = service;
  betButton.enabled = service.initialState.matches(states.IDLE);
  const onStateChanged = state => {
    betButton.enabled = state.matches(`${states.IDLE}.${states.NORMAL}`);
  }
  betButton.on('click', () => send({ type: eventTypes.PLAY, bet: 10 }));
  service.onTransition(onStateChanged);
  return () => {
    service.off(onStateChanged);
  }
}

function createUserPanelMediator(userPanel) {
  const { initialState, send } = service;
  const onStateChanged = state => {
    if ([
      states.IDLE,
      `${states.IDLE}.${states.NORMAL}`,
      `${states.PLAYING}.${states.BET_REQUESTING}`,
      `${states.PLAYING}.${states.WIN_EFFECTS_PLAYING}`
    ].some(state.matches)) {
      userPanel.text = { username: state.context.username, balance: state.context.balance };
    }
  }
  service.onTransition(onStateChanged)
  return () => {
    service.off(onStateChanged);
  }
}

function createMessageMediator(message) {
  const { initialState, send } = service;
  message.text = 'loading...';
  const onStateChanged = state => {
    if (state.matches(`${states.IDLE}.${states.NORMAL}`)) {
      message.text = 'IDLE';
    } else if (state.matches(`${states.PLAYING}.${states.TRANSITION_EFFECTS_PLAYING}`)) {
      message.text = 'play transition ...';
    } else if (state.matches(`${states.PLAYING}.${states.WIN_EFFECTS_PLAYING}`)) {
      message.text = 'win! play win effects ...';
    } else if (state.matches(`${states.IDLE}.${states.BET_NOT_ENOUGH}`)) {
      message.text = 'balance not enough';
    }
  }
  service.onTransition(onStateChanged)
  return () => {
    service.off(onStateChanged);
  }
}

export function createWinLabelMediator(winLabel) {
  const { initialState, send } = service;
  winLabel.text = initialState.context.win;
  const onStateChanged = state => {
    if ([
      `${states.PLAYING}.${states.WIN_EFFECTS_PLAYING}`,
      `${states.IDLE}.${states.NORMAL}`,
    ].some(state.matches)) {
      winLabel.text = state.context.win;
    }
  }
  service.onTransition(onStateChanged);
  return () => {
    service.off(onStateChanged);
  }
}