import { IHand, IPlayer, IGame, ICard } from './interfaces';

export class Player implements IPlayer {
  constructor(game: IGame, readonly hand: IHand) {}

  putCard(card: ICard): void {
    this.hand.removeCard(card);
  }

  take(cards: ICard[]) {
    cards.map(card => this.hand.addCard(card));
  }
}