import { GameObjects, Textures } from "phaser";
import { DurakScene } from "./scenes/durak-scene";

export class HandCard extends GameObjects.Sprite {
  protected oldDepth: number = 0;
  protected onClick: Function;
  public scene: DurakScene;
  constructor(
    scene: DurakScene,
    x: number,
    y: number,
    texture: string | Textures.Texture,
    onClick?: (p: PointerEvent, card: HandCard) => void
  ) {
    super(scene, x, y, texture);

    this.setState("onhand");
    this.addListener("pointerover", this.onMouseOver.bind(this));
    this.addListener("pointerout", this.onMouseOut.bind(this));
    this.addListener("pointerdown", this.onMouseDown.bind(this));
    this.onClick = onClick;
  }

  protected onMouseOver(p: PointerEvent) {
    this.oldDepth = this.depth;
    this.setY(this.y - 30);
    this.setDepth(Number.MAX_SAFE_INTEGER);
  }

  protected onMouseOut() {
    this.setDepth(this.oldDepth);
    this.setY(this.y + 30);
  }

  protected onMouseDown(p: PointerEvent) {
    if (this.onClick) {
      this.onClick(p, this);
    }

    if (this.state === "onhand") {
      const canvas = this.scene.game.canvas;
      this.setPosition(canvas.width * 0.05 + this.scene.slot * 180, canvas.height * 0.36);
      this.scene.slot++;
      this.setState("ontable");
    }
  }
}
