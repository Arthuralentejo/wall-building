import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";
import { ShapeConfig } from "konva/lib/Shape";
import { ITool } from "./tools/ITool";
import { WallTool } from "./tools/WallTool";

export class App {
  public stage: Konva.Stage;
  public layers;
  public tool: ITool;
  constructor(stage?: Konva.Stage) {
    this.stage = stage || new Konva.Stage({
      container: 'canva-holder',
      width: window.innerWidth,
      height: window.innerHeight,
    });
    this.layers = {
      static: new Konva.Layer({ name: "static" }),
      drawing: new Konva.Layer({ name: "drawing" }),
    };
    this.tool = new WallTool();
    this.stage.on("mousemove", this.mouseTracker);
  }

  public drawButton() {
    this.layers.static.add(this.tool.button);
    this.layers.static.batchDraw();
  }

  public init() {
    this.stage.add(this.layers.static, this.layers.drawing);
    this.drawButton();
    this.stage.batchDraw();
  }
  public draw(config: ShapeConfig): void {
    this.tool.draw(config);
    if (this.tool.shape) {
      this.layers.drawing.add(this.tool.shape);
      this.stage.batchDraw();
    }
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