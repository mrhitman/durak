import { ICard, IPack } from './interfaces';
import { shuffle } from 'lodash';

export class Pack implements IPack {
  protected _trump: ICard;
  protected _cards: ICard[]
  private isEmpty: boolean = false;

  constructor(cards: ICard[]) {
    this._cards = cards;
  }

  get cards() {
    return this._cards;
  }

  get trump() {
    return this._trump;
  }

  take(count: number): Array<ICard> {
    if (this.isEmpty) {
      return;
    }

    if (this.cards.length > count) {
      return this.cards.splice(0, count);
    }

    this.isEmpty = true;
    return this.cards.splice(0, Math.min(count, this.cards.length));
  }

  takeOne(): ICard {
    if (this.isEmpty) {
      return;
    }

    if (this.cards.length) {
      return this.cards.shift();
    }

    this.isEmpty = true;
    return this.trump;
  }

  shuffle(): void {
    this._cards = shuffle(this._cards);
    this._trump = this.takeOne();
  }
}
