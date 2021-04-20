import { range, shuffle } from "lodash";
import { GameObjects, Scene } from "phaser";
import { HandCard } from "../hand-card";
import { cards, suits } from "../constants";
import { Game } from "../objects/game";
import { IUserPlayer } from "../objects/interfaces";

interface Card {
  card: string;
  suit: string;
}
type Hand = Array<Card>;
const scale = 0.24;
export class DurakScene extends Scene {
  protected depth = 1;
  protected bg: GameObjects.TileSprite;
  protected pack: Array<Card> = [];
  protected g: Game;
  public slot = 0;

  public preload() {
    this.load.image("table", "assets/table.png");
    this.load.image("back", "assets/green_back.png");
    this.load.image("button", "assets/button.png");

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
    this.g = new Game();
    this.g.deal();
  }

  public create() {
    this.slot = 0;
    this.bg = this.add
      .tileSprite(0, 0, screen.availWidth - 40, screen.availHeight - 130, "table")
      .setOrigin(0, 0);
    this.createPlayerHand(this.game.canvas.width * 0.4, this.game.canvas.height * 0.7);
    this.createEnemyHand(this.game.canvas.width * 0.4, this.game.canvas.height * 0.01);
    this.createPack(this.game.canvas.width * 0.9, this.game.canvas.height * 0.35);
    this.add
      .sprite(70, 30, "button")
      .setOrigin(0.5, 0.5)
      .setInteractive()
      .setScale(0.2, 0.2)
      .addListener("pointerdown", () => {
        this.scene.restart();
        this.create();
      });
    this.add
      .sprite(70, 80, "button")
      .setOrigin(0.5, 0.5)
      .setInteractive()
      .setScale(0.2, 0.2)
      .addListener("pointerdown", () => {
        (this.add as any).displayList.removeAll();
        this.g.switchRoles();
        this.create();
      });
    this.add
      .sprite(70, 120, "button")
      .setOrigin(0.5, 0.5)
      .setInteractive()
      .setScale(0.2, 0.2)
      .addListener("pointerdown", () => {
        // abandond the defence
      });
  }

  public update() {}

  private createEnemyHand(x: number, y: number) {
    const group = this.add.group();

    let offsetX = 0;
    for (const _ of range(0, this.g.defender.hand.cards.length)) {
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
    for (const card of this.g.attacker.hand.cards) {
      const cardSprite = new HandCard(this, x + offsetX, y, `${card.rank}${card.suit}`)
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

  private createPack(x: number, y: number) {
    const group = this.add.group();

    let offsetX = 0;
    group.add(
      this.add
        .sprite(x + 70, y + 118, `${this.g.pack.trump.rank}${this.g.pack.trump.suit}`)
        .setScale(scale, scale)
        .setAngle(90)
        .setOrigin(0.5, 0.05)
    );
    offsetX += 60;

    for (let i = 0; i <= this.g.pack.cards.length; i++) {
      group.add(
        this.add
          .sprite(x + offsetX, y, `back`)
          .setScale(scale, scale)
          .setOrigin(0.5, 0.05)
      );
      offsetX += Math.min(50 / this.g.pack.cards.length, 10);
    }

    return group;
  }
}
