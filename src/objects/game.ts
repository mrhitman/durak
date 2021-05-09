import { chain } from "lodash";
import { Card } from "./card";
import { Hand } from "./hand";
import { CardRank, CardSuit, ICard, IGame, IPack, IPlayer, IUserPlayer } from "./interfaces";
import { Pack } from "./pack";
import { Player } from "./player";

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
  players: IUserPlayer[] = [];

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
    this.players.unshift(this.players.pop());
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

  protected initRoles(players = 2) {
    const MAX_PLAYERS = 4;
    players = Math.min(players, MAX_PLAYERS);

    for (let i = 0; i < players; i++) {
      const player = new Player(this, new Hand([], this.pack.trump));
      this.pack.take(6).map((c) => player.hand.addCard(c));
      this.players.push(player);
    }
    const chainedPlayers = chain(this.players);

    this.attacker = chainedPlayers.sort((p1, p2) => {
      const t1 = p1.hand.getLowestTrump();
      const t2 = p2.hand.getLowestTrump();

      if (t1 && t2) {
        return t1.isGreater(t2) ? 1 : -1;
      }
      
      return t1 ? 1 : -1;
    }).first().value() || chainedPlayers.shuffle().first().value();
  }
}
