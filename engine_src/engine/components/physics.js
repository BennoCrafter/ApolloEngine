/*
 * File: physics.js
 *  
 * core of the physics component
 * 
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!

function resolveCollision(obj1, obj2){
    const vx = (obj1.transform.position.x) - (obj2.transform.position.x);
    const vy = (obj1.transform.position.y) - (obj2.transform.position.y);

    const combinedHalfWidths = (obj1.transform.size.width + obj2.transform.size.width) / 2;
    const combinedHalfHeights = (obj1.transform.size.height + obj2.transform.size.height) / 2;

    if (Math.abs(vx) < combinedHalfWidths && Math.abs(vy) < combinedHalfHeights) {
        const overlapX = combinedHalfWidths - Math.abs(vx);
        const overlapY = combinedHalfHeights - Math.abs(vy);

        if (overlapX >= overlapY) {
            if (vy > 0) {
                obj1.transform.position.y += overlapY;
            } else {
                obj1.transform.position.y -= overlapY;
            }
        } else {
            if (vx > 0) {
                obj1.transform.position.x += overlapX;
            } else {
                obj1.transform.position.x -= overlapX;
            }
        }
    }
}

function process(obj1, obj2){
    if (collides(obj1, obj2)) {
        resolveCollision(obj1, obj2);
    }   
}

function collides(obj1, obj2){
    if( obj1.transform.position.x - obj1.transform.size.width/2 < obj2.transform.position.x - obj2.transform.size.width/2 + obj2.transform.size.width &&
        obj1.transform.position.x - obj1.transform.size.width/2 + obj1.transform.size.width > obj2.transform.position.x - obj2.transform.size.width/2&&
        obj1.transform.position.y < obj2.transform.position.y + obj2.transform.size.height &&
        obj1.transform.position.y + obj1.transform.size.height > obj2.transform.position.y){
            console.log("positive")

        }
    return (
        obj1.transform.position.x - obj1.transform.size.width/2 < obj2.transform.position.x - obj2.transform.size.width/2 + obj2.transform.size.width &&
        obj1.transform.position.x - obj1.transform.size.width/2 + obj1.transform.size.width > obj2.transform.position.x - obj2.transform.size.width/2&&
        obj1.transform.position.y < obj2.transform.position.y + obj2.transform.size.height &&
        obj1.transform.position.y + obj1.transform.size.height > obj2.transform.position.y
    );
}
export {
    // Collide
    process, resolveCollision, collides
}