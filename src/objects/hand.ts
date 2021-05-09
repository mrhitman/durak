import { IHand, ICard } from './interfaces';
import { Card } from './card';

export class Hand implements IHand {
  constructor(public cards: ICard[], readonly trump: ICard) {}

  addCard(card: ICard): void {
    this.cards.push(new Card(card.rank, card.suit));
  }

  removeCard(card: ICard): void {
    this.cards = this.cards.filter((hc) => !hc.isEqual(card));
  }

  getLowestTrump(): ICard | null {
    return this.cards.reduce((acc, hc) => {
      if (hc.suit === this.trump.suit) {
        if (acc) {
          return hc.isGreater(acc) ? acc : hc;
        }

        return hc;
      }

      return acc;
    }, null);
  }

  getLowestCard(): ICard | null {
    return this.cards.reduce((acc, hc) => {
      if (acc) {
        return hc.isGreater(acc) ? acc : hc;
      }

      return acc;
    }, null);
  }

  getHigherCard(): ICard | null {
    return this.cards.reduce((acc, hc) => {
      if (acc) {
        return hc.isGreater(acc) ? hc : acc;
      }

      return acc;
    });
  }
}
