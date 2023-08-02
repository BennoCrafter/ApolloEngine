export function Components(){
    var self = this;
    self.all_components = ["rectCollider", "script", "rigidbody"]

    this.rectColliderGenereal = function(obj){
        var obj = {
            position: {x:obj.x, y:obj.y},
            width: obj.width,
            height: obj.height
        }
        return obj;
    }

    this.rectCollider = function(info){
        var obj = {
            width: info.width,
            height: info.height,
            position: {x: info.x, y: info.y},
            collisionEnabled: info.collisionEnabled,
            collides: []
        }    
        return obj;
    }
    
}