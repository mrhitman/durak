import { ICard, IPack } from './interfaces';
import { shuffle } from 'lodash';

export class Pack implements IPack {
  protected _trump: ICard;
  protected _cards: ICard[]

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
    return this.cards.splice(0, count);
  }

  takeOne(): ICard {
    return this.cards.shift();
  }

  shuffle(): void {
    this._cards = shuffle(this._cards);
    this._trump = this.takeOne();
  }
}
