import { IGame, IPack, ICard, CardRank, CardSuit, IPlayer } from "./interfaces";
import { Player } from "./player";
import { Hand } from "./hand";
import { Pack } from "./pack";
import { Card } from "./card";
import { random } from "lodash";
import { IUserPlayer } from "./interfaces";

enum GameState {
  start,
  attacking,
  defencing,
  gameover,
}

export class Game implements IGame {
  public tableCards: ICard[] = [];
  public discardPile: ICard[] = [];
  public beatenTableCards: ICard[] = [];
  public pack: IPack;
  protected state: GameState;

  attacker: IUserPlayer;
  defender: IUserPlayer;

  constructor() {
    this.state = GameState.start;
  }

  beat(card: ICard, target: ICard): void {
    if (card.canBeat(target, this.pack.trump.suit)) {
      this.beatenTableCards.push(card);
      this.beatenTableCards.push(target);
      this.tableCards = this.tableCards.filter(c => !c.isEqual(card));
    }
  }

  toAbandonTheDefence(): void {
    this.tableCards.map((card) => this.defender.hand.addCard(card));
    this.tableCards.length = 0;
  }

  successfullDefense(): void {
    this.discardPile.push(...this.tableCards);
    this.tableCards.length = 0;
  }

  pullHands(): void {
    const players = [this.attacker, this.defender];

    players.map(player => {
      const hand = player.hand;
      const rest = 6 - hand.cards.length;

      if (rest > 0) {
        this.pack.take(rest).map((c) => c && player.hand.addCard(c));
      }
    });
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
    const cards = [];
    for (let rank of Object.values(CardRank)) {
      for (let suit of Object.values(CardSuit)) {
        cards.push(new Card(rank, suit));
      }
    }

    this.pack = new Pack(cards);
    this.pack.shuffle();
    this.initRoles();
  }

  onCardClick(player: IPlayer, card: ICard) {
    player.put(card);
    this.toTable(card);
    this.state = GameState.attacking;
  }

  protected initRoles() {
    const player1 = new Player(this, new Hand([], this.pack.trump));
    const player2 = new Player(this, new Hand([], this.pack.trump));
    this.pack.take(6).map((c) => player1.hand.addCard(c));
    this.pack.take(6).map((c) => player2.hand.addCard(c));

    const p1Trump = player1.hand.getLowestTrump();
    const p2Trump = player2.hand.getLowestTrump();

    let isFirst: boolean = !!p1Trump;
    if (p1Trump && p2Trump) {
      isFirst = p1Trump.isGreater(p2Trump);
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
