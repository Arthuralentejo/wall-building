import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";
import { Shape, ShapeConfig } from "konva/lib/Shape";
import { ITool } from "./ITool";

export class WallTool implements ITool {
  public button: Konva.Rect;
  public active: boolean;
  public name: string;
  private buttonDefautlStyle: ShapeConfig = {
    x: 20,
    y: 20,
    width: 30,
    height: 30,
    opacity: 0.5,
    fill: "lightblue",
    stroke: "blue",
  }
  public shape?: Shape<ShapeConfig>;
  constructor(config?: ShapeConfig) {
    this.name = "WallTool";
    this.active = false;
    this.button = new Konva.Rect(config || this.buttonDefautlStyle);
    // this.button.on("click", this.toggleTool);
    this.button.on("mouseover mouseout", this.hoverButtonStyle);

  }
  public updateShape(config?: ShapeConfig): void {
    throw new Error("Method not implemented.");
  }
  public eraseDrawing(): void {
    this.shape?.destroy();
  }

  public draw(config?: ShapeConfig): Konva.Shape {
    this.shape = new Konva.Rect({
      ...config,
      fill: "lightblue",
      stroke: "blue",
      strokeWidth: .5,
      draggable: true,
    } || {});

    this.shape.on("click", (e: KonvaEventObject<MouseEvent>) => {
      let tr = new Konva.Transformer({
        enabledAnchors: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
      });
      
      tr.nodes([this.shape as Konva.Rect]);
      e.target.getLayer().add(tr);
      e.target.getLayer().batchDraw();
    });
    this.shape.on("transform dragmove", (e: KonvaEventObject<MouseEvent>) => {
      const x = Math.round(e.target.x());
      const y = Math.round(e.target.y());
      
      const widthInput = <HTMLInputElement>document.querySelector('#widthInput');
      const heightInput = <HTMLInputElement>document.querySelector('#heightInput');
      const xInput = <HTMLInputElement>document.querySelector('#xInput');
      const yInput = <HTMLInputElement>document.querySelector('#yInput');

      widthInput.value = e.target.width().toString();
      heightInput.value = e.target.height().toString();
      xInput.value = x.toString();
      yInput.value = y.toString();
    });

    return this.shape;
  }

  // startDraw(e: KonvaEventObject<MouseEvent>): void {
  //   throw new Error("Method not implemented.");
  // }

  // endDraw(e: KonvaEventObject<MouseEvent>): void {
  //   throw new Error("Method not implemented.");
  // }

  private hoverButtonStyle(e: KonvaEventObject<MouseEvent>): void {
    if (document.body.style.cursor != "crosshair") {
      const mouseover = e.type === "mouseover";
      document.body.style.cursor = mouseover ? "pointer" : "default";
      e.target.setAttr("opacity", mouseover ? 1 : 0.5);
    }
  }

  // private toggleTool(e: KonvaEventObject<MouseEvent>) {
  //   e.cancelBubble = true;

  //   if (!this.active) {
  //     RectTool.active = true;
  //     RectTool.stage.on("click", RectTool.draw);
  //   } else {
  //     RectTool.active = false;
  //     RectTool.eraseDrawing();
  //   }
  //   document.body.style.cursor = RectTool.active ? "crosshair" : "default"
  // }
}