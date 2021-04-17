import { AUTO, Game, Scene, GameObjects } from 'phaser';

const cards = [
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  'J',
  'Q',
  'K',
  'A',
];
const suits = ['C', 'H', 'D', 'S'];

class DurakScene extends Scene {
  protected bg: GameObjects.TileSprite;
  protected cards: Record<string, GameObjects.TileSprite>;

  public preload() {
    this.load.image('table', 'assets/table.png');

    for (const card of cards) {
      for (const suit of suits) {
        this.load.image(`${card}${suit}`, `assets/${card}${suit}.png`);
      }
    }
  }

  public create() {
    this.bg = this.add
      .tileSprite(0, 0, screen.availWidth, screen.availHeight, 'table')
      .setOrigin(0, 0);

    this.add
      .sprite(0, 0, '2C')
      .setScale(0.2, 0.2)
      .setOrigin(0, 0);
  }

  public update() {}
}

const game = new Game({
  width: screen.availWidth,
  height: screen.availHeight,
  type: AUTO,
  parent: 'content',
  backgroundColor: '#304858',
  scene: [DurakScene],
});
