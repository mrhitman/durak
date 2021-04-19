import { GameObjects, Scene, Textures } from 'phaser';
import { DurakScene } from './scenes/durak-scene';

export class PackCard extends GameObjects.Sprite {
  public scene: DurakScene;
  constructor(
    scene: DurakScene,
    x: number,
    y: number,
    texture: string | Textures.Texture,
  ) {
    super(scene, x, y, texture);

    this.setState('inpack');
    this.addListener('pointerdown', this.onMouseDown.bind(this));
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
