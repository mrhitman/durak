import { AUTO, Game } from "phaser";
import { DurakScene } from "./scenes/durak-scene";

const game = new Game({
  width: screen.availWidth - 20,
  height: screen.availHeight - 130,
  type: AUTO,
  parent: "content",
  backgroundColor: "#304858",
  scene: [DurakScene],
});
