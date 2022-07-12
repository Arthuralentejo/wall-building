import Konva from 'konva';
import { KonvaEventObject } from 'konva/lib/Node';

export class RectTool {
  public static rect: Konva.Rect;
  public static active: boolean = false;
  public static drawing: boolean = false;
  public static staticLayer: Konva.Layer;
  public static rectLayer: Konva.Layer;
  public static dinamicLayer: Konva.Layer;
  public static stage: Konva.Stage;

  static init(stage: Konva.Stage, x?: number, y?: number, width?: number, height?: number): void {
    RectTool.stage = stage;
    RectTool.stage.on("mousemove", RectTool.mousetracker);

    RectTool.staticLayer = new Konva.Layer();
    RectTool.rectLayer = new Konva.Layer();
    RectTool.dinamicLayer = new Konva.Layer();

    RectTool.stage.add(RectTool.staticLayer, RectTool.rectLayer, RectTool.dinamicLayer);
    RectTool.drawButton(x, y, width, height);
    RectTool.drawQuickInfoCard();
  }
  static mousetracker(e: KonvaEventObject<MouseEvent>){ 
    const {x, y} = e.currentTarget.getRelativePointerPosition();
    return {x, y};
    // RectTool.updateCoordinates(x,y);
  }

  public static drawButton(x?: number, y?: number, width?: number, height?: number): void {
    const button = new Konva.Rect({
      x: x || 180,
      y: y || 20,
      width: width || 30,
      height: height || 30,
      opacity: 0.5,
      fill: "lightblue",
      stroke: "blue",
    });
    button.on("click", RectTool.toggleTool);
    button.on("mouseover mouseout", RectTool.hoverButtonStyle);
    RectTool.staticLayer.add(button);
  }

  public static hoverButtonStyle(e: KonvaEventObject<MouseEvent>): void {
    if (!RectTool.active) {
      const mouseover = e.type === "mouseover";
      document.body.style.cursor = mouseover ? "pointer" : "default";
      e.target.setAttr("opacity", mouseover ? 1 : 0.5);
    }
  }

  public static drawQuickInfoCard(){
    const group = new Konva.Group({
      draggable: true,
    });
    const rect = new Konva.Rect({
      x: 5,
      y: 5,
      width: 150,
      height: 150,
      fill: "grey",
      stroke: "black",
      strokeWidth: 1,
      opacity: 0.8,
    });
    const size = new Konva.Text({
      x: 10,
      y: 10,
      text: "Hello World",
      fontSize: 15,
      fontFamily: "Calibri",
      fill: "white",
    });

    const coord = new Konva.Text({
      x: 10,
      y: 100,
      text: `Pointer: `,
      fontSize: 15,
      fontFamily: "Calibri",
      fill: "white",
    });
    group.add(rect, size, coord);
    RectTool.dinamicLayer.add(group);
  }

  public static toggleTool(e: KonvaEventObject<MouseEvent>) {
    e.cancelBubble = true;
    if (!RectTool.active) {
      RectTool.active = true;      
      RectTool.stage.on("click", RectTool.draw);
    } else {
      RectTool.active = false;
      RectTool.eraseDrawing();
    }
    document.body.style.cursor = RectTool.active ? "crosshair" : "default"
  }

  public static eraseDrawing(): void {
    RectTool.rectLayer.destroyChildren();
  }

  public static draw(e: KonvaEventObject<MouseEvent>): void {
    e.cancelBubble = true;
    if (RectTool.active) {
      if (!RectTool.drawing) {
        RectTool.stage.on("click", RectTool.startDraw);
        RectTool.stage.on("mousemove", RectTool.mousemoveHandler);
      } else{      
        console.log(RectTool.rect.toObject());
          
        RectTool.drawing = false;
        RectTool.active = false;
        RectTool.rect.width(e.currentTarget.getRelativePointerPosition().x - RectTool.rect.x());
        RectTool.rect.height(e.currentTarget.getRelativePointerPosition().y - RectTool.rect.y());
        RectTool.rectLayer.batchDraw();
        document.body.style.cursor = "default"    
        RectTool.stage.off("click mousemove");
      }
    }
  }


  public static startDraw(e: KonvaEventObject<MouseEvent>) {
    RectTool.drawing = true;
    RectTool.rect = new Konva.Rect({
      x: e.currentTarget.getRelativePointerPosition().x,
      y: e.currentTarget.getRelativePointerPosition().y,
      width: 0,
      height: 0,
      fill: "lightblue",
      stroke: "blue",
    });
    RectTool.rectLayer.add(RectTool.rect);
    RectTool.rectLayer.batchDraw();
  }

  public static mousemoveHandler(e: KonvaEventObject<MouseEvent>): void {
    const newWidth = e.currentTarget.getRelativePointerPosition().x - RectTool.rect.x();
    const newHeight = e.currentTarget.getRelativePointerPosition().y - RectTool.rect.y();
    RectTool.rect.width(newWidth);
    RectTool.rect.height(newHeight);
    RectTool.rectLayer.batchDraw();
  }
}