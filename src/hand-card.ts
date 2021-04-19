import { GameObjects, Textures } from 'phaser';
import { DurakScene } from './scenes/durak-scene';

export class HandCard extends GameObjects.Sprite {
  protected oldDepth: number = 0;
  public scene: DurakScene;
  constructor(
    scene: DurakScene,
    x: number,
    y: number,
    texture: string | Textures.Texture,
  ) {
    super(scene, x, y, texture);

    this.setState('onhand');
    this.addListener('pointerover', this.onMouseOver.bind(this));
    this.addListener('pointerout', this.onMouseOut.bind(this));
    this.addListener('pointerdown', this.onMouseDown.bind(this));
  }

  protected onMouseOver(p: PointerEvent) {
    this.oldDepth = this.depth;
    this.setDepth(Number.MAX_SAFE_INTEGER);
  }

  protected onMouseOut() {
    this.setDepth(this.oldDepth);
  }

  protected onMouseDown(p: PointerEvent) {
    if (this.state === 'onhand') {
      const canvas = this.scene.game.canvas;
      this.setPosition(
        canvas.width * 0.05 + this.scene.slot * 180,
        canvas.height * 0.36,
      );
      this.scene.slot++;
      this.setState('ontable');
    }
  }
}