
"use strict";  // Operate in Strict mode such that variables must be declared before used!

import engine from "../engine_src/engine/index.js";


class Test extends engine.Scene {
    constructor() {
        super();
        this.speed = 0.3
        this.mCamera = null;
        this.player = null;
        this.coin = null
        this.mRenderableBox = null;
    }

    load() {}

    unload() {}

    init() {
        // Step A: set up the cameras
        this.mCamera = new engine.Camera(
            vec2.fromValues(50, 50), // position of the camera
            100,                        // width of camera
            [0, 0, 800, 600],         // viewport (orgX, orgY, width, height)
        );
        
        this.score = new engine.FontRenderable("Score:", 40,85, 5)
        this.player = new engine.GameObject(new engine.Renderable("blue"), 70, 70, 10, 10, 0);
        this.platform = new engine.GameObject(new engine.Renderable("green"), 50, 30, 70, 10,0)
        
        this.coin = new engine.GameObject(new engine.Renderable("yellow"), 70, 40, 10, 10, 0)
        let cc = new engine.ColliderRectangle(this.coin.transform);
        let pc = new engine.ColliderRectangle(this.player.transform);
        this.coin.setCollider(cc)
        this.player.setCollider(pc)
        this.platform.setCollider(new engine.ColliderRectangle(this.platform.transform))
    }

    // This is the draw function, make sure to setup proper drawing environment, and more
    // importantly, make sure to _NOT_ change any state.
    draw() {
        // Step A: clear the canvas
        engine.clearCanvas([0.9, 0.9, 0.9, 1.0]); // canvas color
        this.mCamera.setViewAndCameraMatrix();

        this.player.draw(this.mCamera)
        this.coin.draw(this.mCamera)
        this.score.draw(this.mCamera)
        this.platform.draw(this.mCamera)
    }

    // The Update function, updates the application state. Make sure to _NOT_ draw
    // anything from this function!
    update() {
        this.player.transform.position.y -= this.speed + 0.2
        if (engine.input.isKeyPressed(engine.input.keys.A)){
            this.player.transform.position.x -= this.speed
        }
        if (engine.input.isKeyPressed(engine.input.keys.D)){
            this.player.transform.position.x += this.speed
        }
        if (engine.input.isKeyPressed(engine.input.keys.W)){
            this.player.transform.position.y += this.speed
        }
        if (engine.input.isKeyPressed(engine.input.keys.S)){
            this.player.transform.position.y -= this.speed
        }
        if (engine.input.isKeyPressed(engine.input.keys.X)){
            this.player.transform.rotation += 0.1
        }
        
        engine.physics.process(this.player, this.platform)
    }


    next() {
        super.next();
        // Step B: starts the next level
        // starts the next level
    }
}

window.onload = function () {
    engine.init("GLCanvas");

    let myGame = new Test();
    myGame.start();
}
