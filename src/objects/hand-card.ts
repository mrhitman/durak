import { Card } from './card';
import { IHandCard } from './interfaces';

export class HandCard extends Card implements IHandCard {
  
  attack(): void {
    throw new Error('Method not implemented.');
  }
}