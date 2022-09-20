import { Container, Text } from 'pixi.js';
import { Background, Label, Button, TextGroup } from './ui';

class UserPanel extends Container {
  constructor() {
    super();
    this.addChild(new Background({w: 300, h: 30, color: 0x333333}));
    this.label = new Label();
    this.label.y = 4;
    this.addChild(this.label);
    this.text = { username: '', balance: '' };
  }

  set text({ username, balance }) {
    this.label.text = `username: ${username}, balance: ${balance}`;
    this.label.x = (300 - this.label.width) * .5 | 0;
  }
}

class WinLabel extends Container {
  constructor() {
    super();
    this.addChild(new Background({w: 300, h: 20, color: 0xff0000}));
    this.label = new Label();
    this.addChild(this.label);
  }

  set text(value) {
    this.label.text = `win: ${value}`;
    this.label.x = (this.width - this.label.width) * .5 | 0;
  }
}


export default class MainUI extends Container {
  constructor() {
    super();

    this.userPanel = new UserPanel();
    this.addChild(this.userPanel);

    this.winLabel = new WinLabel();
    this.winLabel.y = 30;
    this.addChild(this.winLabel);

    this.message = new Label();
    this.message.y = 60;
    this.addChild(this.message);

    this.betButton = new Button({ w: 300, h: 30, bgColor: 0xeeeeee, textColor: 0x000000, text: 'bet' });
    this.betButton.y = 170;
    this.addChild(this.betButton);
  }
}
