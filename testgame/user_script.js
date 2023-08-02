import { GameEngine } from "/core/engine.js";
import { Components } from "/core/components.js";
import { GameObject } from "/core/GameObjects.js";
import Velocity from '/core/velocity.js';
// Create a new game engine
const gameEngine = new GameEngine();
const components = new Components();
gameEngine.init(700, 500);
// Initialize and start the game engine
gameEngine.start();
var score_count = 0;
var speed = 7;
//gameEngine.hide_mouse_cursor()
// Create a new game object
var player_collider = components.rectCollider({
  collide: false,
  collisionEnabled: true
});

var player_collider_big = components.rectCollider({
  collide: false,
  width: 400,
  height: 400
});

var coin_collider = components.rectCollider({
  collide: false,
});

var enemy_collider = components.rectCollider({
  collide: false,
  collisionEnabled: true
});

var player = new GameObject({
  type: "rectangle",
  width: 40,
  height: 40,
  position: {x:100, y:200},
  color: "blue",
  components: [
    { type: "collider", name: "player_collider", obj: player_collider },
    { type: "collider", name: "player_collider_big", obj: player_collider_big },
  ], // c},
  //collider: player_collider
});

var test = new GameObject({
  type: "rectangle",
  width: 400,
  height: 50,
  position: {x:10, y:300},
  color: "green",
  components: [{ type: "collider", name: "border_collider", obj: components.rectCollider({
    collisionEnabled: true
  })}]
})
var coin = new GameObject({
  rotation: 0,
  type: "rectangle",
  width: 30,
  height: 30,
  color: "yellow",
  position: {x:200, y:100},
  components: [{ type: "collider", name: "coin_collider", obj: coin_collider }],
});


var score = new GameObject({
  type: "text",
  width: 3,
  height: 4,
  font: "40px Arial",
  color: "orange",
  text: "Score: 0",
  position: {x:150, y:50},
  angle: 0,
  components: [],
});

var enemy = new GameObject({
  type: "rectangle",
  color: "red",
  width: 40,
  height: 40,
  position: {x:100, y:100},
  components: [
    { type: "collider", name: "enemy_collider", obj: enemy_collider },
  ],
});

var own_sprite = new GameObject({
  type: "custom",
  position: {x:100, y:100},
  height: 50,
  width: 50,
  img_src: "",
  components: [],
});
player.velocity = new Velocity()

gameEngine.addObject([player, coin, enemy, score, own_sprite, test]);

  gameEngine.update = function(){
    coin.rotate(1)
    player.velocity.default()
    if (gameEngine.pressedKey("w")) {
        player.velocity.y = -1;
    }
    player.move(player.velocity);
    console.log(player.velocity)
    // Retrieve the correct collider objects
    const playerCollider = player.getComponent("player_collider");
    const playerColliderBig = player.getComponent("player_collider_big");
    const coinCollider = coin.getComponent("coin_collider");
    const enemyCollider = enemy.getComponent("enemy_collider");
    if (gameEngine.collided(playerCollider, coinCollider)) {
      score_count += 1;
      score.data.text = "Score: " + score_count;
      coin.data.x = gameEngine.getRandomInt(gameEngine.canvas.width);
      coin.data.y = gameEngine.getRandomInt(gameEngine.canvas.height);
    }
    if (gameEngine.collided(playerColliderBig, enemyCollider)) {
    // console.log("dead")
    }
  }