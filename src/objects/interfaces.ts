export enum CardRank {
  "two" = "2",
  "three" = "3",
  "four" = "4",
  "fifth" = "5",
  "six" = "6",
  "seven" = "7",
  "eight" = "8",
  "nine" = "9",
  "ten" = "10",
  "Jack" = "J",
  "Queen" = "Q",
  "King" = "K",
  "Ace" = "A",
}

export enum CardSuit {
  "Diamonds" = "D",
  "Spades" = "S",
  "Clubs" = "C",
  "Hearts" = "H",
}

export interface ICard {
  rank: CardRank;
  suit: CardSuit;
  isGreater(card: ICard): boolean;
  isEqual(card: ICard): boolean;
  canBeat(card: ICard, trump: CardSuit): boolean;
}

export interface IHand {
  cards: Array<ICard>;
  addCard(card: ICard): void;
  removeCard(card: ICard): void;
  getLowestTrump(): ICard | null;
  getLowestCard(): ICard | null;
  getHigherCard(): ICard | null;
}

export interface IPack {
  trump: ICard;
  cards: Array<ICard>;
  take(count: number): Array<ICard>;
  takeOne(): ICard;
  shuffle(): void;
}

export interface IPlayer {
  putCard(card: ICard): void;
  take(cards: ICard[]): void;
}

export interface IUserPlayer extends IPlayer {
  hand: IHand;
}

export interface IEnemyPlayer extends IPlayer {
  handCount: number;
}

export interface IGame {
  tableCards: Array<ICard>;
  beatenTableCards: Array<ICard>;
  discardPile: Array<ICard>;
  pack: IPack;
  players: IUserPlayer[];
  attacker: IPlayer;
  defender: IPlayer;

  deal(playerCount: number): void;
  swapRoles(): void;
  beatCard(card: ICard, target: ICard): void;
  toAbandonTheDefence(): void;
  successfullDefense(): void;
  attackWithCard(card: ICard): void;
  discardCard(card: ICard): void;
}
