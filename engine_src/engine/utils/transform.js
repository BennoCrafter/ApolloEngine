/*
 * File: transform.js 
 *
 * Encapsulates the matrix transformation functionality, meant to work with
 * Renderable
 */
"use strict";

class Transform {
    /**
     * @classdesc Encapsulates the matrix transformation functionality, meant to work with Renderables
     * <p>Found in Chapter 3, page 84 of the textbook</p>
     * Example:
     * {@link https://apress.github.io/build-your-own-2d-game-engine-2e/BookSourceCode/chapter3/3.3.transform_objects/index.html 3.3 Transform Objects}
     * @constructor
     * @returns {Transform} a new Transform instance
     */
    constructor() {
        this.position = {x: 0, y: 0}
        this.size = {width: 0, height: 0}
        this.rotation = 0.0
    }

    setTransform(x,y,width,height,rotation){
        this.position = {x: x, y:y}
        this.size = {width: width, height: height}
        this.rotation = rotation
    }
    /**
     * Sets the x and y position of this Transform in world coordinates
     * @method
     * @param {float} xPos - the x position of the Transform
     * @param {float} yPos - the y position of the Transform
     */
    setPosition(xPos, yPos) { this.setXPos(xPos); this.setYPos(yPos); }

    /**
     * Returns the world coordinate position of this Transform
     * @method
     * @returns {vec2} mPosition - the x and y position of this Transform
     */
    getPosition() { return this.position.x; }

    /**
     * Returns the three dimensional world coordinate position of this Transform
     * @method
     * @returns {vec3} the x,y,z position of this Transform
     */
    get3DPosition() { return vec3.fromValues(this.getXPos(), this.getYPos(), 0); }

    /**
     * Returns the x world coordinate position of this Transform
     * @method
     * @returns {float} mPosition[0] - the x world coordinate position of this Transform
     */
    getXPos() { return this.position.x; }

    /**
     * Sets the x world Coordinate of this Tranform
     * @method
     * @param {float} xPos - the x position to set for this Transform 
     */
    setXPos(xPos) { this.position.x = xPos; }

    /**
     * Add a value to the x world coordinate of this Transform
     * @method
     * @param {float} delta - the value to be added to the current x value 
     */    /**
     * Returns the y world coordinate position of this Transform
     * @method
     * @returns {float} mPosition[0] - the y world coordinate position of this Transform
     */
    getYPos() { return this.position.y; }
    /**
     * Sets the y world Coordinate of this Tranform
     * @method
     * @param {float} yPos - the y position to set for this Transform 
     */
    setYPos(yPos) { this.position.y = yPos; }
    /**
     * Add a value to the y world coordinate of this Transform
     * @method
     * @param {float} delta - the value to be added to the current y value 
     */
    incYPosBy(delta) { this.position.y += delta; }


    /**
     * Sets the size of this Transform
     * @param {float} width - the new width of this Transform
     * @param {float} height - the new height of this Transform
     */
    setSize(width, height) {
        this.setWidth(width);
        this.setHeight(height);
    }

    /**
     * Returns the width and height of this Transform
     * @method
     * @returns {vec2} mScale - the width and height of this Transform
     */
    getSize() { return this.size; }

    /**
     * Adds a value to the width and height of this Transform
     * @method
     * @param {float} delta - the value to be added to both the width and height
     */
    incSizeBy(delta) {
        this.incWidthBy(delta);
        this.incHeightBy(delta);
    }

    /**
     * Returns the width of this Transform
     * @method
     * @returns {float} mScale[0] - the width of this Transform
     */
    getWidth() { return this.size.width; }

    /**
     * Set the width of this Transform
     * @param {float} width - new width
     */
    setWidth(width) { this.size.width = width; }

    /**
     * Adds a delta to the width
     * @param {float} delta - the value to add
     */
    incWidthBy(delta) { this.size.width += delta; }

    /**
     * Returns the height of this Transform
     * @method
     * @returns {float} mScale[1] - the height of this Transform
     */
    getHeight() { return this.size.height; }

    /**
     * Sets the new height of this Transform
     * @method
     * @param {float} height  - the new height to set for this Transform
     */
    setHeight(height) { this.size.height = height; }

    /**
     * Add a value to the height of this Transform
     * @method
     * @param {float} delta - the value to be added to the height
     */
    incHeightBy(delta) { this.size.height += delta; }

     /**
     * Sets the new rotation in degrees of this Transform, internally bounded to [0,360]
     * @method
     * @param {float} rotationInDegree - the new rotation value for this Transform
     */
    setRotation(rotationInDegree) {
        this.rotation = rotationInDegree
    }

    /**
     * Adds deltaDegree to the current rotation value of this Transform
     * @method
     * @param {float} deltaDegree - value to be added to the rotation, in degrees
     */
    incRotationByDegree(deltaDegree) {
        this.rotation += deltaDegree
    }
    /**
     * Returns the width of this Transform in degrees
     * @method
     * @returns {float} the rotation of this Transform in degrees
     */
    getRotation() { return this.rotation}
    
    // returns the matrix the concatenates the transformations defined
    /**
     * Returns the matrix of this Transform used to control Renderables
     * @method
     * @returns {mat4} matrix - the translated, rotated, and scaled matrix
     */ 
    getTRSMatrix() {
        // Creates a blank identity matrix
        let matrix = mat4.create();

        // The matrices that WebGL uses are transposed, thus the typical matrix
        // operations must be in reverse.

        // Step A: compute translation, for now z is the height
        mat4.translate(matrix, matrix, this.get3DPosition());
        // Step B: concatenate with rotation.
        mat4.rotateZ(matrix, matrix, this.getRotation());
        // Step C: concatenate with scaling
        mat4.scale(matrix, matrix, vec3.fromValues(this.getWidth(), this.getHeight(), 1.0));

        return matrix;
    }
}

export default Transform;