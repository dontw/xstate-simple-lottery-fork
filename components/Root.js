import React from 'react';
import PixiCanvas from './PixiCanvas';
import { Global, css } from '@emotion/core';
import { ThemeProvider, CSSReset, theme, Box, Flex, Text} from '@chakra-ui/core';
import styled from '@emotion/styled';
import Lottery from './Lottery';

const Container = styled(Flex)`
  & > div { 
    margin-right: 20px;
  }
`;


export default function Root() {
  return (
    <>
      <Global
        styles={css`
        body {
          user-select: none;
          -webkit-touch-callout: none;
          -webkit-user-select: none;
          -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
        }
      `}
      />
      <ThemeProvider theme={theme}>
        <CSSReset />
        <Text pl="16px" pt="16px">xstate simple lottery example</Text>
        <Container  w="100%" h="600px" m="16px" flexWrap="wrap">
          <Box>
            <Text textAlign="center">React</Text>
            <Lottery />
          </Box>
          <Box>
            <Text textAlign="center">Pixi.js</Text>
            <PixiCanvas />
          </Box>
        </Container>
      </ThemeProvider>
    </>
  );
}

