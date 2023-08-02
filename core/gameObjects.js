
export class GameObject {
    constructor(information) {
      this.data = information;
      this.init();
    }
  
    sprite_update() {
        this.updateComponents()
    }
  
    draw() {}
  
    move(vel) {
      this.data.position.x += vel.x
      this.data.position.y += vel.y
    }
  
    rotate(degrees) {
      this.data.rotation += degrees;
    }
  
    setPosition(x, y) {
      this.data.position.x = x
      this.data.position.y = y
      
    }
  
    setPositionMiddle(x, y) {
      this.data.position.x = x - this.data.width / 2;
      this.data.position.y = y - this.data.height / 2;
    }
  
    getComponent(comp_name) {
      for (let component of this.data.components) {
        if (component.name === comp_name) {
          return component.obj;
        }
      }
    }
    
    updateComponents(){
        // exampel: comp_x = 10, x = 0 || x = 11
        for (let component of this.data.components) {
          component.obj.position.x = this.data.position.x + component.obj.position.difference_x
          component.obj.position.y = this.data.position.y + component.obj.position.difference_y
          component.obj.rotation = this.data.rotation;
        }
    }
    
    init() {      
      if (this.data.components == undefined) {
        this.data.components = [];
      }
    
      // User can write extended code, what will happen when the object is generated
      for (let component of this.data.components) {
        if (component.type === "collider") {
          if (component.obj.width === undefined) {
            component.obj.width = this.data.width;
          }
          if (component.obj.height === undefined) {
            component.obj.height = this.data.height;
          }
          if (component.obj.position.x === undefined){
            component.obj.position.x = this.data.position.x
          }
          if (component.obj.position.y === undefined){
            component.obj.position.y = this.data.position.y
          }
          component.obj.position.y -= component.obj.height/2;
          component.obj.position.x -= component.obj.width/2 

          this.data.position.x -= this.data.width /2
          this.data.position.y -= this.data.height / 2;

          component.obj.position.difference_x = component.obj.position.x - this.data.position.x;
          component.obj.position.difference_y = component.obj.position.y - this.data.position.y;

        } 
      }
    }
    
  }
  