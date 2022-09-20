import React, { useEffect, useRef } from 'react';
import MainUI from './../pixi/views/MainUI';
import { createMediators } from './../pixi/mediators';
import { Box } from '@chakra-ui/core';
import { Application } from 'pixi.js';

export default function PixiCanvas() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const stage = new MainUI();
    const app = new Application({ view: canvas, width: 300, height: 200, resolution: window.devicePixelRatio, autoDensity: true });
    app.stage.addChild(stage);
    const clear = createMediators(stage);
    return () => {
      app.stop();
      clear();
    }
  }, []);
  
  return (
    <Box ref={canvasRef} as="canvas" w="300px" h="200px" />
  );
}
