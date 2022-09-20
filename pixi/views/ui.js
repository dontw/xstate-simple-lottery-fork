import { Graphics, Container, Text } from 'pixi.js';

export class Label extends Text {
  constructor({ color } = { color: 'white'}) {
    super('', { fill: color, fontSize: 16 });
  }
}

export const Background = ({ color, w, h }) => {
  const g = new Graphics();
  g.beginFill(color);
  g.drawRect(0, 0, w, h);
  g.endFill();
  return g;
}

export function Group({ w, h, color } = { w: 200, h: 200, color: 0xdddddd }) {
  const container = new Container();
  const bg = new Background(({ w, h, color }));
  container.addChild(bg);
  return container;
}

export class TextGroup extends Container {
  constructor({ w, h, bgColor, textColor, text } = { w: 200, h: 20, bgColor: 0x666666, textColor: 0x0 }) {
    super();
    this.bg = new Background(({ w, h, color: bgColor }));;
    this.addChild(this.bg);
    this.label = new Label({ color: textColor });
    this.label.y = (this.height - this.label.height) * .5 | 0;
    this.addChild(this.label);
    this.text = text;
  }

  set text(text) {
    this.label.text = text;
    this.label.x = (this.width - this.label.width) * .5 | 0;
  }
}

export class Button extends TextGroup {
  constructor({ w, h, bgColor, textColor, text } = { w: 200, h: 20, bgColor: 0x666666, textColor: 0x000000, text: '' }) {
    super({ w, h, bgColor, textColor, text });
    this.interactive = true;
    this.buttonMode = true;
  }
  set enabled(value) {
    this.bg.alpha = value ? 1 : .45;
    this.interactive = value;
  }
}
