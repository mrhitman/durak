export enum CardRank {
  'two' = '2',
  'three' = '3',
  'four' = '4',
  'fifth' = '5',
  'six' = '6',
  'seven' = '7',
  'eight' = '8',
  'nine' = '9',
  'ten' = '10',
  'Jack' = 'J',
  'Queen' = 'Q',
  'King' = 'K',
  'Ace' = 'A',
}

export enum CardSuit {
  'Diamonds' = 'D',
  'Spades' = 'S',
  'Clubs' = 'C',
  'Hearts' = 'H',
}

export interface ICard {
  rank: CardRank;
  suit: CardSuit;
  isGreater(card: ICard): boolean;
  isEqual(card: ICard): boolean;
}

export interface IHandCard extends ICard {
  attack(): void;
}

export interface IHand {
  cards: Array<IHandCard>;
  addCard(card: ICard): void;
  removeCard(card: ICard): void;
  getLowestTrump(): IHandCard | null;
  getLowestCard(): IHandCard | null;
  getHigherCard(): IHandCard | null;
}

export interface IPack {
  trump: ICard;
  cards: Array<ICard>;
  take(count: number): Array<ICard>;
  takeOne(): ICard;
  shuffle(): void;
}

export interface IPlayer {}

export interface IUserPlayer extends IPlayer {
  hand: IHand;
}

export interface IEnemyPlayer extends IPlayer {
  handCount: number;
}

export interface IGame {
  tableCards: Array<ICard>;
  discardPile: Array<ICard>;
  pack: IPack;
  attacker: IPlayer;
  defender: IPlayer;

  deal(): void;
  swapRoles(): void;
  toAbandonTheDefence(): void;
  successfullDefense(): void;
  toTable(card: ICard): void;
  toDiscard(card: ICard): void;
}
