import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";
import { Shape, ShapeConfig } from "konva/lib/Shape";
import { ITool } from "./ITool";

export class WallTool implements ITool {
  public icon: Konva.Rect;
  public isActive: boolean;
  public name: string;
  public isDrawing: boolean;

  private iconDefautlStyle: ShapeConfig = {
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
    this.isActive = false;
    this.isDrawing = false;
    this.icon = new Konva.Rect(config || this.iconDefautlStyle);
  }
  drawing(e: Konva.KonvaEventObject<MouseEvent>): void {
    if (this.shape && this.isDrawing) {
      this.updateShape({
        width: e.currentTarget.getRelativePointerPosition().x - this.shape.x(),
        height: e.currentTarget.getRelativePointerPosition().y - this.shape.y(),
      });
    }
  }


  public updateShape(config: ShapeConfig): void {
    if (this.shape) {
      this.shape.setAttrs(config);
    }
  }
  public eraseDrawing(): void {
    this.shape?.destroy();
  }

  public draw(config?: ShapeConfig): void {
    if (this.shape) {
      this.shape.setAttrs(config);
    } else {
      this.shape = new Konva.Rect({
        ...config,
        fill: "lightblue",
        stroke: "blue",
        strokeWidth: .5,
        draggable: true,
      } || {});
    }
  }

  public startDraw(e: KonvaEventObject<MouseEvent>): void {
    this.draw({
      x: e.currentTarget.getRelativePointerPosition().x,
      y: e.currentTarget.getRelativePointerPosition().y,
      width: 100,
      height: 100
    });
  }

  public endDraw(e: KonvaEventObject<MouseEvent>): void {
    if (this.shape) {
      this.isActive = false;
      this.isDrawing = false;
      this.shape.width(e.currentTarget.getRelativePointerPosition().x - this.shape.x());
      this.shape.height(e.currentTarget.getRelativePointerPosition().y - this.shape.y());
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