import { IHand, IHandCard, ICard } from './interfaces';
import { HandCard } from './hand-card';

export class Hand implements IHand {
  constructor(public cards: IHandCard[], readonly trump: ICard) {}

  addCard(card: ICard): void {
    this.cards.push(new HandCard(card.rank, card.suit));
  }

  removeCard(card: ICard): void {
    this.cards = this.cards.filter((hc) => !hc.isEqual(card));
  }

  getLowestTrump(): IHandCard | null {
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

  getLowestCard(): IHandCard | null {
    return this.cards.reduce((acc, hc) => {
      if (acc) {
        return hc.isGreater(acc) ? acc : hc;
      }

      return acc;
    }, null);
  }

  getHigherCard(): IHandCard | null {
    return this.cards.reduce((acc, hc) => {
      if (acc) {
        return hc.isGreater(acc) ? hc : acc;
      }

      return acc;
    });
  }
}
