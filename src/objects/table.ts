import { ICard, ITable } from './interfaces';

export class Table implements ITable {
  cards: ICard[];
  discard: ICard[];

  constructor() {
    this.cards = [];
    this.discard = [];
  }

  add(card: ICard): void {
    this.cards.push(card);
  }

  toDiscard(card: ICard): void {
    this.cards = this.cards.filter(c => !c.isEqual(card));
    this.discard.push(card);
  }

  successfullDefense(): void {
    this.discard.push(...this.cards);
    this.cards.length = 0;
  }

  toAbandonTheDefence(): void {
    this.cards.length = 0;
  }
}
