/*
 * File: shader_resources.js
 *  
 * defines drawing system shaders
 * 
 */
"use strict";

import SimpleShader from "../shaders/simple_shader.js";
import TextureShader from "../shaders/texture_shader.js";
import SpriteShader from "../shaders/sprite_shader.js";
import LineShader from "../shaders/line_shader.js";
import * as text from "../resources/text.js";
import * as map from "./resource_map.js";

/**
 * Resource bank for all shaders
 * 
 * <p>Found in Chapter 3, page 68 of the textbook </p>
 * Example:
 * {@link https://apress.github.io/build-your-own-2d-game-engine-2e/BookSourceCode/chapter3/3.1.renderable_objects/index.html 3.1 Renderable Objects}
 * @module shader_resources
 */
 
// Simple Shader
let kSimpleVS = "/engine_src/glsl_shaders/simple_vs.glsl";  // Path to the VertexShader 
let kSimpleFS = "/engine_src/glsl_shaders/simple_fs.glsl";  // Path to the simple FragmentShader
let mConstColorShader = null;

// Texture Shader
let kTextureVS = "/engine_src/glsl_shaders/texture_vs.glsl";  // Path to the VertexShader 
let kTextureFS = "/engine_src/glsl_shaders/texture_fs.glsl";  // Path to the texture FragmentShader
let mTextureShader = null;
let mSpriteShader = null;

// Line Shader
let kLineFS = "/engine_src/glsl_shaders/line_fs.glsl";        // Path to the Line FragmentShader
let mLineShader = null;

// Light Shader
let kLightFS = "/engine_src/glsl_shaders/light_fs.glsl";  // Path to the Light FragmentShader
let mLightShader = null;

// Illumination Shader
let kIllumFS = "/engine_src/glsl_shaders/illum_fs.glsl";  // Path to the Illumination FragmentShader
let mIllumShader = null;

// Shadow shaders
let kShadowReceiverFS = "/engine_src/glsl_shaders/shadow_receiver_fs.glsl";  // Path to the FragmentShader
let mShadowReceiverShader = null;
let kShadowCasterFS = "/engine_src/glsl_shaders/shadow_caster_fs.glsl";  // Path to the FragmentShader
let mShadowCasterShader = null;

// Particle Shader
let kParticleFS = "/engine_src/glsl_shaders/particle_fs.glsl";
let mParticleShader = null;

/**
 * Creates new instances of the shaders for renderables to use
 * @export shader_resources
 */
function createShaders() {
    mConstColorShader = new SimpleShader(kSimpleVS, kSimpleFS);
    mTextureShader = new TextureShader(kTextureVS, kTextureFS);
    mSpriteShader = new SpriteShader(kTextureVS, kTextureFS);
    mLineShader =  new LineShader(kSimpleVS, kLineFS);
}

/**
 * Cleans up each shader and unload their vertex and fragment shaders
 * @export shader_resources
 */
function cleanUp() {
    mConstColorShader.cleanUp();
    mTextureShader.cleanUp();
    mSpriteShader.cleanUp();
    mLineShader.cleanUp();

    text.unload(kSimpleVS);
    text.unload(kSimpleFS);
    text.unload(kTextureVS);
    text.unload(kTextureFS);
    text.unload(kLineFS);
    text.unload(kLightFS);
    text.unload(kIllumFS);
    text.unload(kShadowCasterFS);
    text.unload(kShadowReceiverFS);
    text.unload(kParticleFS);
}

/**
 * Initializes all the shaders, promising them to the resource map
 * @export shader_resources
 */
function init() {
    let loadPromise = new Promise(
        async function(resolve) {
            await Promise.all([
                text.load(kSimpleFS),
                text.load(kSimpleVS),
                text.load(kTextureFS),
                text.load(kTextureVS),
                text.load(kLineFS),
            ]);
            resolve();
        }).then(
            function resolve() { createShaders(); }
        );
    map.pushPromise(loadPromise);
}

/**
 * Returns the shader object used for constant colored shapes
 * @export shader_resources
 * @returns {SimpleShader} instance of SimpleShader for Renderables to use
 */
function getConstColorShader() { return mConstColorShader; }

/**
 * Returns the shader object used for textures
 * @export shader_resources
 * @returns {TextureShader} instance of TextureShader for TextureRenderables to use
 */
function getTextureShader() { return mTextureShader; }

/**
 * Returns the shader object used for rendering sprites
 * @export shader_resources
 * @returns {SpriteShader} instance of SpriteShader for SpriteRenderables to use
 */
function getSpriteShader() { return mSpriteShader; }

/**
 * Returns the shader object used for rendering lines
 * @export shader_resources
 * @returns {LineShader} instance of LineShader for LineRenderables to use
 */
function getLineShader() { return mLineShader; }


export {init, cleanUp, 
        getConstColorShader, getTextureShader, getSpriteShader, getLineShader,
        }