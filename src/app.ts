import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";
import { ShapeConfig } from "konva/lib/Shape";
import { Rect } from "konva/lib/shapes/Rect";
import { ITool } from "./tools/ITool";
import { WallTool } from "./tools/WallTool";

export class App {
  private stage: Konva.Stage;
  private WALL_HEIGHT: number = 300;
  private layers;
  private shapes: Konva.Shape[] = [];
  private isToolActive: boolean = false;
  private button: HTMLElement | null;
  public selected: Konva.Node | null = null;
  private isAnimating: boolean = false;
  constructor() {
    this.stage = new Konva.Stage({
      container: 'canva-holder',
      width: window.innerWidth,
      height: window.innerHeight,
    });
    this.layers = {
      static: new Konva.Layer({ name: "static" }),
      drawing: new Konva.Layer({ name: "drawing" }),
    };
    this.button = document.querySelector('.tool');
    this.stage.on("mousemove", this.mouseTracker);
  }

  private toggleTool(e): void {
    console.log("Tipo do obj evento: " + typeof e);

    this.isToolActive = !this.isToolActive;
    e.currentTarget.classList.toggle("active");
    document.body.style.cursor = this.isToolActive ? "crosshair" : "default"
    if (this.isToolActive) {
      this.stage.on("click", this.toggleAnimation);
    } else {
      this.stage.off("click");
    }

  }
  private toggleAnimation(e: KonvaEventObject<MouseEvent>): void {
    this.isAnimating = !this.isAnimating;
    if (this.isAnimating) {
      this.selected = e.target;
      this.draw(e.target.getRelativePointerPosition());
    } else{
      this.selected = null;
      this.endDraw(e.target.getRelativePointerPosition());
    }
  }
  endDraw(location: {
    x: number;
    y: number;
  }) {
    throw new Error("Method not implemented.");
  }

  public init() {
    this.stage.add(this.layers.static, this.layers.drawing);
    this.button?.addEventListener("click", this.toggleTool);
    this.stage.batchDraw();
  }

  private draw(location: {
    x: number;
    y: number;
  }): void {
    const wall = new Konva.Rect({
      height: this.WALL_HEIGHT,
      width: 1,
      x: location.x,
      y: location.y,
      fill: "lightblue",
      stroke: "blue",
      strokeWidth: .5,
      draggable: true,      
    })
    this.addShape(wall);
  }
  addShape(wall: Konva.Rect) {
    this.layers.drawing.add(wall);
    this.shapes.push(wall);
    this.layers.drawing.batchDraw();
  }


  private mouseTracker(e: KonvaEventObject<MouseEvent>): void {
    const { x, y } = e.currentTarget.getRelativePointerPosition();
    let mouseXOutput = document.querySelector('#mouseX');
    let mouseYOutput = document.querySelector('#mouseY');
    if (mouseXOutput && mouseYOutput) {
      mouseXOutput.innerHTML = "X: " + x.toString();
      mouseYOutput.innerHTML = "Y: " + y.toString();
    }
  }
}