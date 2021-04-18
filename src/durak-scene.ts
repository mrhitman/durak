import { range, shuffle } from "lodash";
import { GameObjects, Scene } from "phaser";
import { cards, suits } from "./constants";

interface Card {
  card: string;
  suit: string;
}
type Hand = Array<Card>;
interface Pack {
  trump: Card;
  cardsCount: number;
}

const scale = 0.24;
let depth = 1;
export class DurakScene extends Scene {
  protected bg: GameObjects.TileSprite;
  protected cards: Record<string, GameObjects.TileSprite>;
  protected pack: Array<Card> = [];

  public preload() {
    this.load.image("table", "assets/table.png");
    this.load.image("back", "assets/green_back.png");

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
      .tileSprite(0, 0, screen.availWidth - 40, screen.availHeight - 130, "table")
      .setOrigin(0, 0);

    this.createPlayerHand(
      [
        this.takeCardFromPack(),
        this.takeCardFromPack(),
        this.takeCardFromPack(),
        this.takeCardFromPack(),
        this.takeCardFromPack(),
        this.takeCardFromPack(),
      ],
      this.game.canvas.width * 0.4,
      this.game.canvas.height * 0.7
    );
    const enemyHand = [
      this.takeCardFromPack(),
      this.takeCardFromPack(),
      this.takeCardFromPack(),
      this.takeCardFromPack(),
      this.takeCardFromPack(),
      this.takeCardFromPack(),
    ];

    this.createEnemyHand(
      enemyHand.length,
      this.game.canvas.width * 0.4,
      this.game.canvas.height * 0.01
    );
    this.createPack(
      this.takeCardFromPack(),
      this.pack.length,
      this.game.canvas.width * 0.9,
      this.game.canvas.height * 0.35
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
          .setOrigin(0, 0)
      );
      offsetX += 24;
    }

    return group;
  }

  private createPlayerHand(hand: Hand, x: number, y: number) {
    const group = this.add.group();

    let offsetX = 0;
    for (const card of hand) {
      const obj = this.add
        .sprite(x + offsetX, y, `${card.card}${card.suit}`)
        .setDepth(depth++)
        .setScale(scale, scale)
        .setOrigin(0, 0)
        .setInteractive();

      obj
        .addListener(
          "pointerover",
          (p: PointerEvent) => {
            obj.setState(obj.depth);
            obj.setDepth(Number.MAX_SAFE_INTEGER);
          },
          this
        )
        .addListener(
          "pointerout",
          (p: PointerEvent) => {
            obj.setDepth(+obj.state);
          },
          this
        )
        .addListener(
          "pointerdown",
          () => {
            console.log("click");
          },
          this
        );

      group.add(obj);
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
        .setOrigin(0.5, 0.05)
    );
    offsetX += 60;

    range(0, count).map(() => {
      group.add(
        this.add
          .sprite(x + offsetX, y, `back`)
          .setScale(scale, scale)
          .setOrigin(0.5, 0.05)
      );
      offsetX += Math.min(50 / count, 10);
    });

    return group;
  }

  private takeCardFromPack() {
    return this.pack.pop();
  }
}
