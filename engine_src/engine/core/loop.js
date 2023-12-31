/*
 * File: loop.js
 *  
 * interfaces with HTML5 to implement looping functionality, supports start/end loop
 * 
 */
"use strict";

import * as map from "./resource_map.js";
import * as input from "../components/input.js";
import * as debugDraw from "./debug_draw.js";

/**
 * Interface with HTML5 to implement looping functionality
 * <p>Found in Chapter 4, page  112 of the textbook</p>
 * 
 * Example:
 * {@link https://apress.github.io/build-your-own-2d-game-engine-2e/BookSourceCode/chapter4/4.1.game_loop/index.html 4.1 Game Loop}
 * @module loop
 */

const kUPS = 60; // Updates per second
const kMPF = 1000 / kUPS; // Milliseconds per update.
const kSPU = 1/kUPS; // seconds per update

// Variables for timing gameloop.
let mPrevTime;
let mLagTime;

// The current loop state (running or should stop)
let mLoopRunning = false;
let mCurrentScene = null;
let mFrameID = -1;

// This function loops over draw/update once
function loopOnce() {
    if (mLoopRunning) {
        // Step A: set up for next call to loopOnce
        mFrameID = requestAnimationFrame(loopOnce);

        // Step B: now let's draw
        //         draw() MUST be called before update()
        //         as update() may stop the loop!
        mCurrentScene.draw();    

        // Step C: compute how much time has elapsed since  last loopOnce was executed
        let currentTime = performance.now();
        let elapsedTime = currentTime - mPrevTime;
        mPrevTime = currentTime;
        mLagTime += elapsedTime;

        // Step D: Make sure we update the game the appropriate number of times.
        //      Update only every kMPF (1/60 of a second)
        //      If lag larger then update frames, update until caught up.
        while ((mLagTime >= kMPF) && mLoopRunning) {
            input.update();
            mCurrentScene.update();      
            mLagTime -= kMPF;
        }
    } 
}

/**
 * Returns how many seconds pass between updates, normally a small fraction
 * @export loop
 * @returns {float} kSPU - seconds per update
 */
function getUpdateIntervalInSeconds() { return kSPU; }

async function start(scene) {
    if (mLoopRunning) {
        throw new Error("loop already running")
    }
    mCurrentScene = scene;
    mCurrentScene.load();
    
    // Wait for any async requests before game-load
    await map.waitOnPromises();
        
    // With all resources loaded, it is now possible to initialize 
    // System internal functions that depends on resources (shaders, etc.)
    debugDraw.init();  // drawing support for rigid shapes, etc.
    
    // Now, initialize current scenes
    mCurrentScene.init();    
    mPrevTime = performance.now();
    mLagTime = 0.0;
    mLoopRunning = true;
    mFrameID = requestAnimationFrame(loopOnce);
}

/**
 * Stop the game loop
 * @export loop
 */
function stop() {
    mLoopRunning = false;
    // make sure no more animation frames
    cancelAnimationFrame(mFrameID);
}

/**
 * Stop the game loop and unload the current scene
 * @export loop
 */
function cleanUp() {
    if (mLoopRunning) {
        stop();

        // unload all resources
        mCurrentScene.unload();
        mCurrentScene = null;
    }
}

export {start, stop, cleanUp, getUpdateIntervalInSeconds}