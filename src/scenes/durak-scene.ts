import { range, shuffle } from 'lodash';
import { GameObjects, Scene } from 'phaser';
import { HandCard } from '../hand-card';
import { cards, suits } from '../constants';

interface Card {
  card: string;
  suit: string;
}
type Hand = Array<Card>;
const scale = 0.24;
export class DurakScene extends Scene {
  protected depth = 1;
  protected bg: GameObjects.TileSprite;
  protected hand: Array<HandCard>;
  protected pack: Array<Card> = [];
  public slot = 0;

  public preload() {
    this.load.image('table', 'assets/table.png');
    this.load.image('back', 'assets/green_back.png');

    for (const card of cards) {
      for (const suit of suits) {
        this.pack.push({
          card,
          suit,
        });
        this.load.image(`${card}${suit}`, `assets/${card}${suit}.png`);
      }
    }
    this.pack = shuffle(this.pack);
  }

  public create() {
    this.bg = this.add
      .tileSprite(
        0,
        0,
        screen.availWidth - 40,
        screen.availHeight - 130,
        'table',
      )
      .setOrigin(0, 0);

    this.createPlayerHand(
      this.takeCardsFromPack(6),
      this.game.canvas.width * 0.4,
      this.game.canvas.height * 0.7,
    );
    const enemyHand = this.takeCardsFromPack(6);

    this.createEnemyHand(
      enemyHand.length,
      this.game.canvas.width * 0.4,
      this.game.canvas.height * 0.01,
    );
    this.createPack(
      this.takeCardFromPack(),
      this.pack.length,
      this.game.canvas.width * 0.9,
      this.game.canvas.height * 0.35,
    );
  }

  public update() {}

  private createEnemyHand(count: number, x: number, y: number) {
    const group = this.add.group();

    let offsetX = 0;
    for (const _ of range(0, count)) {
      group.add(
        this.add
          .sprite(x + offsetX, y, `back`)
          .setScale(scale, scale)
          .setOrigin(0, 0),
      );
      offsetX += 24;
    }

    return group;
  }

  private createPlayerHand(hand: Hand, x: number, y: number) {
    const group = this.add.group();

    let offsetX = 0;
    for (const card of hand) {
      const cardSprite = new HandCard(
        this,
        x + offsetX,
        y,
        `${card.card}${card.suit}`,
      )
        .setDepth(this.depth++)
        .setScale(scale, scale)
        .setOrigin(0, 0.1)
        .setInteractive();

      this.add.existing(cardSprite);

      group.add(cardSprite);
      offsetX += 30;
    }

    return group;
  }

  private createPack(card: Card, count: number, x: number, y: number) {
    const group = this.add.group();

    let offsetX = 0;
    group.add(
      this.add
        .sprite(x + 70, y + 118, `${card.card}${card.suit}`)
        .setScale(scale, scale)
        .setAngle(90)
        .setOrigin(0.5, 0.05),
    );
    offsetX += 60;

    for (let i = 0; i <= count; i++) {
      group.add(
        this.add
          .sprite(x + offsetX, y, `back`)
          .setScale(scale, scale)
          .setOrigin(0.5, 0.05),
      );
      offsetX += Math.min(50 / count, 10);
    }

    return group;
  }

  private takeCardFromPack() {
    return this.pack.shift();
  }

  private takeCardsFromPack(count: number = 1) {
    return this.pack.splice(0, count);
  }
}
