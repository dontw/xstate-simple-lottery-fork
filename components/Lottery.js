import React, { useEffect, useState } from 'react';
import { service, states, eventTypes } from './../fsm/LotteryMachine';
import { useService } from '@xstate/react';
import { Button, Box, Text } from '@chakra-ui/core';

const WinLabel = () => {
  const [current, send] = useService(service);
  const [message, setMessage] = useState(current.context.win);
  useEffect(() => {
    if ([
      `${states.PLAYING}.${states.WIN_EFFECTS_PLAYING}`,
      `${states.IDLE}.${states.NORMAL}`,
    ].some(current.matches)) {
      setMessage(current.context.win);
    }
  }, [current]);
  return (
    <Box w="100%" h="20px" background="red" color="white" textAlign="center" lineHeight="20px">
      <Text>win: {message}</Text>
    </Box>
  )
}

const BetButton = () => {
  const [current, send] = useService(service);
  const onBetBtnClick = () => {
    send(eventTypes.PLAY, { bet: 10 });
  };
  return (
    <Button
      w="100%" h="30px" position="absolute" bottom="0"
      onClick={onBetBtnClick}
      disabled={current.matches(`${states.IDLE}.${states.NORMAL}`) ? '' : 'disabled'}>
      bet
    </Button>
  )
}

const UserPanel = () => {
  const [current, send] = useService(service);
  const [currentBalance, setCurrentBalance] = useState(current.context.balance);
  const { username, balance } = current.context;
  useEffect(() => {
    if ([
      states.IDLE,
      `${states.IDLE}.${states.NORMAL}`,
      `${states.PLAYING}.${states.BET_REQUESTING}`,
      `${states.PLAYING}.${states.WIN_EFFECTS_PLAYING}`
    ].some(current.matches)) {
      setCurrentBalance(balance);
    }
  }, [current]);

  return (
    <Box w="100%" h="30px" bg="black" color="white" textAlign="center" lineHeight="30px">
      <Text>{`username: ${username}, balance: ${currentBalance}`}</Text>
    </Box>
  )
}

export default function Lottery() {
  const [current, send] = useService(service);
  const [message, setMessage] = useState('loading...');
  const { win } = current.context;

  useEffect(() => {
    if (current.matches(`${states.IDLE}.${states.NORMAL}`)) {
      setMessage('IDLE');
    } else if (current.matches(`${states.PLAYING}.${states.TRANSITION_EFFECTS_PLAYING}`)) {
      setMessage('play transition ...');
    } else if (current.matches(`${states.PLAYING}.${states.WIN_EFFECTS_PLAYING}`)) {
      setMessage('win! play win effects ...');
    } else if (current.matches(`${states.IDLE}.${states.BET_NOT_ENOUGH}`)) {
      setMessage('balance not enough');
    }
  }, [current]);

  useEffect(() => {
    if (current.matches(`${states.PLAYING}.${states.TRANSITION_EFFECTS_PLAYING}`)) {
      setTimeout(() => {
        if (win > 0) {
          send(eventTypes.PLAY_WIN_EFFECTS);
        } else {
          send(eventTypes.IDLE);
        }
      }, 2000);
    }
  }, [current]);

  useEffect(() => {
    if (current.matches(`${states.PLAYING}.${states.WIN_EFFECTS_PLAYING}`)) {
      setTimeout(() => {
        send(eventTypes.IDLE);
      }, 2000);
    }
  }, [current]);

  useEffect(() => {
    if (current.matches(`${states.IDLE}.${states.BET_NOT_ENOUGH}`)) {
       setTimeout(() => {
        send(eventTypes.IDLE);
      }, 2000);
    }
  }, [current]);

  return (
    <Box position="relative" bg="silver" w="300px" h="200px" minWidth="300px">
      <UserPanel />
      <WinLabel />
      <Text>{message} </Text>
      <BetButton />
    </Box>
  );
}