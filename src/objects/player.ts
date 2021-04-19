import { IHand, IPlayer } from './interfaces';

export class Player implements IPlayer {
  constructor(readonly hand: IHand) {}
}