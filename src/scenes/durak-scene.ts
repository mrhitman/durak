import { random, range } from "lodash";
import { GameObjects, Scene } from "phaser";
import { HandCard } from "../hand-card";
import { cards, suits } from "../constants";
import { Game } from "../objects/game";

const scale = 0.24;
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

  public create() {
    this.slot = this.engine.tableCards.length;
    this.bg = this.add
      .tileSprite(0, 0, screen.availWidth - 40, screen.availHeight - 130, "table")
      .setOrigin(0, 0);
    this.createPlayerHand(this.game.canvas.width * 0.4, this.game.canvas.height * 0.7);
    this.createEnemyHand(this.game.canvas.width * 0.4, this.game.canvas.height * 0.01);
    this.createTableHand(this.game.canvas.width * 0.2, this.game.canvas.height * 0.5)
    this.createDiscardCards(this.game.canvas.width * 0.1, this.game.canvas.height * 0.9)
    this.createPack(this.game.canvas.width * 0.9, this.game.canvas.height * 0.35);
    this.add
      .sprite(70, 30, "button")
      .setOrigin(0.5, 0.5)
      .setInteractive()
      .setScale(0.1, 0.1)
      .addListener("pointerdown", () => {
        this.scene.restart();
        this.create();
        this.slot = 0;
      });
    this.add.text(50, 24, 'RESET', { color: '#000' });
    this.add
      .sprite(70, 80, "button")
      .setOrigin(0.5, 0.5)
      .setInteractive()
      .setScale(0.1, 0.1)
      .addListener("pointerdown", () => {
        this.clear();
        this.engine.swapRoles();
        this.create();
      });
    this.add.text(54, 74, 'SWAP', { color: '#000' });

    this.add
      .sprite(70, 130, "button")
      .setOrigin(0.5, 0.5)
      .setInteractive()
      .setScale(0.1, 0.1)
      .addListener("pointerdown", () => {
        this.clear();
        this.engine.toAbandonTheDefence();
        this.engine.pullHands();
        this.create();
      });
    this.add.text(54, 124, 'PASS', { color: '#000' });

    this.add
      .sprite(70, 180, "button")
      .setOrigin(0.5, 0.5)
      .setInteractive()
      .setScale(0.1, 0.1)
      .addListener("pointerdown", () => {
        this.clear();
        this.engine.successfullDefense();
        this.engine.swapRoles();
        this.engine.pullHands();
        this.create();
      });

    this.add.text(54, 174, 'END STEP', { color: '#000' });
  }

  public update() { }

  private clear() {
    (this.add as any).displayList.removeAll();
  }

  private createEnemyHand(x: number, y: number) {
    const group = this.add.group();

    let offsetX = 0;
    for (const _ of range(0, this.engine.defender.hand.cards.length)) {
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

  private createPlayerHand(x: number, y: number) {
    const group = this.add.group();

    let offsetX = 0;
    for (const card of this.engine.attacker.hand.cards) {
      const cardSprite = new HandCard(this, x + offsetX, y, `${card.rank}${card.suit}`, () => {
        this.engine.onCardClick(this.engine.attacker, card);
      })
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
