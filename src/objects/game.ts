import { IGame, IPack, IPlayer, ITable, CardRank, CardSuit } from "./interfaces";
import { Player } from "./player";
import { Hand } from "./hand";
import { Table } from "./table";
import { Pack } from "./pack";
import { Card } from "./card";
import { random } from "lodash";
import { IUserPlayer } from "./interfaces";

export class Game implements IGame {
  readonly table: ITable;
  public pack: IPack;
  attacker: IUserPlayer;
  defender: IUserPlayer;

  constructor() {
    this.table = new Table();
  }

  switchRoles(): void {
    const tmp = this.attacker;
    this.attacker = this.defender;
    this.defender = tmp;
  }

  deal(): void {
    console.log("DEAL");
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

    if (p1Trump && p2Trump) {
      if (p1Trump.isGreater(p2Trump)) {
        this.attacker = player2;
        this.defender = player1;
      } else {
        this.attacker = player1;
        this.defender = player2;
      }
      return;
    }

    if (p1Trump && !p2Trump) {
      this.attacker = player1;
      this.defender = player2;
      return;
    }

    if (p2Trump && !p1Trump) {
      this.attacker = player2;
      this.defender = player1;
      return;
    }

    if (random(0, 100) >= 50) {
      this.attacker = player1;
      this.defender = player2;
    } else {
      this.attacker = player1;
      this.defender = player2;
    }
  }
}
