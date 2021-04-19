import { CardRank, CardSuit, ICard } from './interfaces';

export class Card implements ICard {
  constructor(readonly rank: CardRank, readonly suit: CardSuit) {}

  isEqual(card: ICard): boolean {
    return card.rank === this.rank && card.suit === this.suit;
  }

  isGreater(card: ICard): boolean {
    const keys = Object.values(CardRank);
    return keys.indexOf(this.rank) > keys.indexOf(card.rank);
  }
}
