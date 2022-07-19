import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";
import { IProperties, QuickProperty } from "./tools/QuickProperty";

export class App {
  private stage: Konva.Stage;
  private quickProperties: QuickProperty;
  private layers;
  private shapes: Konva.Shape[] = [];
  private isToolActive: boolean = false;
  private button: HTMLElement | null;
  public selected: Konva.Rect | null = null;
  private isAnimating: boolean = false;
  constructor() {
    this.quickProperties = new QuickProperty();
    this.stage = new Konva.Stage({
      container: 'canva-holder',
      width: window.innerWidth,
      height: window.innerHeight,
    });
    this.layers = {
      static: new Konva.Layer({ name: "static" }),
      drawing: new Konva.Layer({ name: "drawing" }),
    };
    this.button = document.querySelector('.toolIcon');
    this.stage.on("mousemove", this.mouseMoveHandler.bind(this));
  }

  private toggleTool(): void {
    this.isToolActive = !this.isToolActive;
    document.body.style.cursor = this.isToolActive ? "crosshair" : "default"
    if (this.isToolActive) {
      this.stage.on("click", this.toggleAnimation.bind(this));
    } else {
      this.stage.off("click");
    }
  }

  private toggleAnimation(e: KonvaEventObject<MouseEvent>): void {
    this.isAnimating = !this.isAnimating;
    if (this.isAnimating) {
      let shape = this.draw(e.target.getRelativePointerPosition());
      this.selectShape(shape);
    } else{
      this.unselectShape();
      this.endDraw();
    }
  }

  
  public init() {
    this.stage.add(this.layers.static, this.layers.drawing);
    this.button?.addEventListener("click", this.toggleTool.bind(this));
    
    this.stage.batchDraw();
  }
  
  private draw(location: {
    x: number;
    y: number;
  }): Konva.Rect {
    const wall = new Konva.Rect({
      height: 300,
      width: 1,
      x: location.x,
      y: location.y,
      fill: "lightblue",
      stroke: "blue",
      strokeWidth: .5,
      draggable: true,      
    })
    this.addShape(wall);
    return wall;
  }

  private updateShape(x: number, y: number): void {    
    if (this.selected) {
      this.selected.setAttr("width", x - this.selected.x());
      this.layers.drawing.draw();
      this.quickProperties.update(this.getPropsFromShape(this.selected));
    }
  }

  private endDraw() {
    this.toggleTool()
    this.isAnimating = false;
  }
  
  private addShape(wall: Konva.Rect) {
    this.layers.drawing.add(wall);
    this.shapes.push(wall);
    this.layers.drawing.batchDraw();
  }
  
  private unselectShape() {
    this.selected = null;
    this.quickProperties.hide();
  }


  private selectShape(shape: Konva.Rect) {
    this.selected = shape;
    this.selected.moveToTop();
    this.layers.drawing.batchDraw();
    this.quickProperties.show(this.getPropsFromShape(shape));
  }

  private getPropsFromShape(shape: Konva.Rect): IProperties {
    return {
      x: shape.x(),
      y: shape.y(),
      length: shape.width(),
      angle: shape.rotation(),
    }
  }

  private mouseMoveHandler(e: KonvaEventObject<MouseEvent>): void {    
    const { x, y } = e.currentTarget.getRelativePointerPosition();
    let mouseXOutput = document.querySelector('#mouseX');
    let mouseYOutput = document.querySelector('#mouseY');
    if (mouseXOutput && mouseYOutput) {
      mouseXOutput.innerHTML = "X: " + x.toString();
      mouseYOutput.innerHTML = "Y: " + y.toString();
    }
    if(this.isAnimating){
      this.updateShape(x, y);
    }
  }
}