import Phaser from "phaser";

import platformTileMap from "./assets/platforms-tilemap.json";
import terrainImg from "./assets/Terrain/Terrain (16x16).png";
import backgroundTile from "./assets/Background/Brown.png";
import playerRunning from "./assets/Main Characters/Ninja Frog/Run (32x32).png";
import playerIdle from "./assets/Main Characters/Ninja Frog/Idle (32x32).png";
import cherryImg from "./assets/Items/Fruits/Cherries.png";

class MyGame extends Phaser.Scene {
  preload() {
    this.load.image("background", backgroundTile);
    this.load.image("terrain", terrainImg);
    this.load.tilemapTiledJSON("platform-tilemap", platformTileMap);
    this.load.spritesheet("player-run", playerRunning, {
      frameWidth: 32,
      frameHeight: 32
    });
    this.load.spritesheet("player-idle", playerIdle, {
      frameWidth: 32,
      frameHeight: 32
    });
    this.load.spritesheet("cherry-idle", cherryImg, {
      frameWidth: 32,
      frameHeight: 32
    });
  }

  create() {
    this.add.tileSprite(400, 300, 800, 600, "background");
    const map = this.make.tilemap({ key: "platform-tilemap" });
    const tiles = map.addTilesetImage("terrain", "terrain");
    const layers = map.createLayer("Tile Layer 1", tiles);
    map.setCollisionByExclusion(-1);

    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("player-run", {
        start: 0,
        end: 11
      }),
      repeat: -1
    });

    this.anims.create({
      key: "idle",
      frames: this.anims.generateFrameNumbers("player-idle", {
        start: 0,
        end: 11
      }),
      repeat: -1
    });

    this.anims.create({
      key: "cherry",
      frames: this.anims.generateFrameNumbers("cherry-idle", {
        start: 0,
        end: 16
      }),
      repeat: -1
    });

    const cherries = this.physics.add.group({
      key: "cherry-idle",
      repeat: 11,
      setXY: { x: 12, y: 0, stepX: 120 }
    });

    cherries.children.iterate((child) => {
      child.play("cherry");
    });

    this.player = this.physics.add.sprite(300, 100, "player-run");
    this.player.setCollideWorldBounds(true);
    this.player.setBounce(0.2);
    this.player.setOffset(0, -1);
    this.physics.add.collider(this.player, layers);
    this.physics.add.collider(cherries, layers);

    this.physics.add.collider(
      this.player,
      cherries,
      this.eatCherries,
      null,
      this
    );

    this.cursors = this.input.keyboard.createCursorKeys();
  }

  update() {
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-160);
      this.player.setFlipX(true);
      this.player.anims.play("right", true);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(160);
      this.player.setFlipX(false);
      this.player.anims.play("right", true);
    } else {
      this.player.setVelocityX(0);
      this.player.anims.play("idle", true);
    }

    if (this.cursors.up.isDown && this.player.body.onFloor()) {
      this.player.setVelocityY(-400);
    }
  }

  eatCherries(player, cherry) {
    cherry.disableBody(true, true);
  }
}

new Phaser.Game({
  type: Phaser.AUTO,
  parent: "phaser3-codealong",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 300 }
      // debug: true
    }
  },
  width: 800,
  height: 600,
  scene: MyGame
});
