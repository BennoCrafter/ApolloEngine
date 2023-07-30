export class GameObject {
    constructor(information) {
      this.data = information;
      this.init();
    }
  
    sprite_update() {
        this.updateComponents()
    }
  
    draw() {}
  
    move(x = 0, y = 0) {
      this.data.x += x;
      this.data.y += y;
    }
  
    rotate(degrees) {
      this.data.rotation += degrees;
    }
  
    setPosition(x, y) {
      this.data.x = x;
      this.data.y = y;
    }
  
    setPositionMiddle(x, y) {
      this.data.x = x - this.data.width / 2;
      this.data.y = y - this.data.height / 2;
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
          component.obj.x = this.data.x + component.obj.difference_x
          component.obj.y = this.data.y + component.obj.difference_y
          component.obj.rotation = this.data.rotation;
        }
    }
    
    init() {
      this.data.x -= this.data.width /2
      this.data.y -= this.data.height / 2;
      
      
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
          if (component.obj.x === undefined){
            component.obj.x = this.data.x
          }
          if (component.obj.y === undefined){
            component.obj.y = this.data.y
          }
          component.obj.y -= component.obj.height/2;
          component.obj.x -= component.obj.width/2 
          component.obj.difference_x = component.obj.x - this.data.x;
          component.obj.difference_y = component.obj.y - this.data.y;

        } 
      }
    }
    
  }
  