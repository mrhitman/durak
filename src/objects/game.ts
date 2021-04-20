import { random } from 'lodash';
import { Card } from './card';
import { Hand } from './hand';
import {
  CardRank,
  CardSuit,
  ICard,
  IGame,
  IPack,
  IUserPlayer,
} from './interfaces';
import { Pack } from './pack';
import { Player } from './player';

export class Game implements IGame {
  public tableCards: ICard[] = [];
  public discardPile: ICard[] = [];
  public pack: IPack;

  attacker: IUserPlayer;
  defender: IUserPlayer;

  constructor() {}

  toAbandonTheDefence(): void {
    this.tableCards.map((c) => this.defender.hand.addCard(c));
    this.tableCards.length = 0;
  }

  successfullDefense(): void {
    this.discardPile.push(...this.tableCards);
    this.tableCards.length = 0;
  }

  toTable(card: ICard): void {
    this.tableCards.push(card);
  }

  toDiscard(card: ICard): void {
    this.tableCards = this.tableCards.filter((c) => !c.isEqual(card));
    this.discardPile.push(card);
  }

  swapRoles(): void {
    const tmp = this.attacker;
    this.attacker = this.defender;
    this.defender = tmp;
  }

  deal(): void {
    console.log('DEAL');
    const cards = [];
    for (let rank of Object.values(CardRank)) {
      for (let suit of Object.values(CardSuit)) {
        cards.push(new Card(rank, suit));
      }
    }

    this.pack = new Pack(cards);
    this.pack.shuffle();
    const player1 = new Player(new Hand([], this.pack.trump));
    const player2 = new Player(new Hand([], this.pack.trump));
    this.pack.take(6).map((c) => player1.hand.addCard(c));
    this.pack.take(6).map((c) => player2.hand.addCard(c));

    const p1Trump = player1.hand.getLowestTrump();
    const p2Trump = player2.hand.getLowestTrump();

    let isFirst: boolean;
    if (p1Trump && p2Trump) {
      isFirst = p1Trump.isGreater(p2Trump);
    } else if (p1Trump && !p2Trump) {
      isFirst = true;
    } else if (p2Trump && !p1Trump) {
      isFirst = false;
    } else {
      isFirst = random(0, 100) >= 50;
      this.defender = player2;
    }

    this.attacker = isFirst ? player1 : player2;
    this.defender = isFirst ? player2 : player1;
  }
}
