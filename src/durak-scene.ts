import { GameObjects, Scene } from "phaser";
import { cards, suits } from "./constants";

interface Card {
  card: typeof cards;
  suit: typeof suits;
}
type Hand = Array<Card>;
interface Pack {
  trump: Card;
  cardsCount: number;
}

export class DurakScene extends Scene {
  protected bg: GameObjects.TileSprite;
  protected cards: Record<string, GameObjects.TileSprite>;

  public preload() {
    this.load.image("table", "assets/table.png");
    this.load.image("back", "assets/green_back.png");

    for (const card of cards) {
      for (const suit of suits) {
        this.load.image(`${card}${suit}`, `assets/${card}${suit}.png`);
      }
    }
  }

  public create() {
    this.bg = this.add
      .tileSprite(0, 0, screen.availWidth - 40, screen.availHeight - 130, "table")
      .setOrigin(0, 0);

    this.add.sprite(0, 0, "2C").setScale(0.24, 0.24).setOrigin(0, 0);
    this.renderHand(
      [
        { card: "K", suit: "H" },
        { card: "10", suit: "D" },
        { card: "2", suit: "D" },
        { card: "7", suit: "D" },
      ] as any,
      0,
      200
    );
  }

  public renderHand(hand: Hand, x: number, y: number) {
    let offsetX = x;
    for (const card of hand) {
      this.add.sprite(offsetX, y, `${card.card}${card.suit}`).setScale(0.24, 0.24).setOrigin(0, 0);
      offsetX += 24;
    }
  }

  public update() {}
}
