import { random, range } from "lodash";
import { GameObjects, Scene } from "phaser";
import { HandCard } from "../hand-card";
import { cards, suits } from "../constants";
import { Game } from "../objects/game";

const scale = 0.22;
export class DurakScene extends Scene {
  protected depth = 1;
  protected bg: GameObjects.TileSprite;
  protected engine: Game;
  public slot = 0;

  public preload() {
    this.load.image("table", "assets/table.png");
    this.load.image("back", "assets/green_back.png");
    this.load.image("button", "assets/button.png");

    for (const card of cards) {
      for (const suit of suits) {
        this.load.image(`${card}${suit}`, `assets/${card}${suit}.png`);
      }
    }
    this.engine = new Game();
    this.engine.deal();
  }

  public get width() {
    return this.game.canvas.width;
  }

  public get widthHalf() {
    return this.game.canvas.width / 2;
  }

  public get height() {
    return this.game.canvas.height;
  }

  public get heightHalf() {
    return this.game.canvas.height / 2;
  }

  public get cardWidth() {
    const card = this.game.textures.getFrame('2C');
    return card.width * scale;
  }

  public get cardHeight() {
    const card = this.game.textures.getFrame('2C');
    return card.height * scale;
  }

  public create() {

    this.bg = this.add
      .tileSprite(0, 0, this.width, this.height, "table")
      .setOrigin(0, 0);

    const cardCount = this.engine.attacker.hand.cards.length;
    const spacer = Math.max((this.width * 0.2) / cardCount, 35);
    const handsSize = spacer * (cardCount - 1) + this.cardWidth - spacer;
    this.createPlayerHand(this.widthHalf - handsSize / 2, this.height - this.cardHeight / 2 - this.height * 0.02, spacer);
  }

  public update() { }

  private clearAll() {
    (this.add as any).displayList.removeAll();
  }

  private createEnemyHand(x: number, y: number, i: number) {
    const group = this.add.group();

    let offsetX = 0;
    for (const _ of range(0, this.engine.players[i].hand.cards.length)) {
      group.add(
        this.add
          .sprite(x + offsetX, y, `back`)
          .setScale(scale, scale)
          .setOrigin(0, 0)
      );
      offsetX += 24;
    }

    return group;
  }

  private createPlayerHand(x: number, y: number, spacer = 30) {
    const group = this.add.group();

    let offsetX = 0;
    for (const card of this.engine.attacker.hand.cards) {
      const cardSprite = new GameObjects.Sprite(this, x + offsetX, y, `${card.rank}${card.suit}`)
        .setScale(scale, scale);

      this.add.existing(cardSprite);

      group.add(cardSprite);
      offsetX += spacer;
    }

    return group;
  }

  private createTableHand(x: number, y: number) {
    const group = this.add.group();
      
    let offsetX = 0;
    let slot = 0;
    for (const card of this.engine.tableCards) {
      const cardSprite = new HandCard(this, x + offsetX, y, `${card.rank}${card.suit}`)
        .setDepth(this.depth++)
        .setPosition(this.game.canvas.width * 0.05 + slot * 180, this.game.canvas.height * 0.36)
        .setScale(scale, scale)
        .setState('ontable')
        .setOrigin(0, 0.1)

      slot++;
      this.add.existing(cardSprite);

      group.add(cardSprite);
      offsetX += 60;
    }

    return group;
  }

  private createDiscardCards(x: number, y: number) {
    const group = this.add.group();

    for (const _ of range(0, this.engine.discardPile.length)) {
      group.add(
        this.add
          .sprite(x + random(-10, 10), y + random(-10, 10), `back`)
          .setRotation(random(0, 5))
          .setScale(scale, scale)
          .setOrigin(0.5, 0.5)
      );
    }

    return group;
  }

  private createPack(x: number, y: number) {
    const group = this.add.group();

    let offsetX = 0;
    group.add(
      this.add
        .sprite(x + 70, y + 118, `${this.engine.pack.trump.rank}${this.engine.pack.trump.suit}`)
        .setScale(scale, scale)
        .setAngle(90)
        .setOrigin(0.5, 0.05)
    );
    offsetX += 60;

    for (let i = 0; i <= this.engine.pack.cards.length; i++) {
      group.add(
        this.add
          .sprite(x + offsetX, y, `back`)
          .setScale(scale, scale)
          .setOrigin(0.5, 0.05)
      );
      offsetX += Math.min(50 / this.engine.pack.cards.length, 10);
    }

    return group;
  }
}
