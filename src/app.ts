import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";
import { ShapeConfig } from "konva/lib/Shape";
import { ITool } from "./tools/ITool";
import { WallTool } from "./tools/WallTool";
import { IControls } from "./utils/IControls";

export class App {
  public stage: Konva.Stage;
  public layers;
  public tool: ITool;
  public controls: IControls;
  constructor(controls: IControls, stage?: Konva.Stage) {
    this.controls = controls;
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

  public activateTool(): void {
    this.tool.isActive = !this.tool.isActive;
    this.tool.icon.setAttr("opacity", this.tool.isActive ? 1 : 0.5);
    document.body.style.cursor = this.tool.isActive ? "crosshair" : "default"
    if (this.tool.isActive) {
      this.stage.on("mousedown", (e) => {
        e.cancelBubble = true;
        this.tool.startDraw(e);
        this.tool.shape?.moveTo(this.layers.drawing);
        this.layers.drawing.batchDraw();
      });
      this.stage.on("mousemove", (e) => {
        e.cancelBubble = true;
        this.tool.drawing(e)
        this.layers.drawing.batchDraw();
      });
      this.stage.on("mouseup", (e) => {
        e.cancelBubble = true;
        this.tool.endDraw(e)
        this.layers.drawing.batchDraw();
        document.body.style.cursor = "default"
      });
    } else {
      this.stage.off("mousedown mouseup");
      
    }
    console.log(this.stage.eventListeners);

  }

  private drawIcon() {

    this.tool.icon.on("mouseover mouseout", (e) => {
      if (!this.tool.isActive) {
        const mouseover = e.type === "mouseover";
        document.body.style.cursor = mouseover ? "pointer" : "default";
        e.target.setAttr("opacity", mouseover ? 1 : 0.5);
      }
    });
    this.tool.icon.on("click", (e) => {
      e.cancelBubble = true;
      this.activateTool()
    })

    this.layers.static.add(this.tool.icon);
    this.layers.static.batchDraw();
  }

  public init() {
    this.stage.add(this.layers.static, this.layers.drawing);
    this.drawIcon();
    this.stage.batchDraw();
    this.addControlsEventListeners();
  }

  private addControlsEventListeners() {
    const form = this.controls.drawButton.parentNode
    form?.addEventListener('change', (e) => {
      const target = e.target as HTMLInputElement;
      this.tool.updateShape({ [target.name]: parseInt(target.value) })
    });

    this.controls.drawButton.addEventListener('click', (e) => {
      e.preventDefault();
      const config = this.controls.getControlsValues();
      this.draw(config);
    });
  }

  public draw(config: ShapeConfig): void {
    if (!this.tool.shape) {
      this.tool.draw(config);
    }
    this.addShapeEventListeners();
    this.layers.drawing.add(this.tool.shape!);
    this.stage.batchDraw();
  }

  private addShapeEventListeners() {
    if (this.tool.shape) {
      this.tool.shape.on("click", (e: KonvaEventObject<MouseEvent>) => {
        let tr = new Konva.Transformer({
          enabledAnchors: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
        });

        tr.nodes([this.tool.shape as Konva.Rect]);
        e.target.getLayer().add(tr);
        e.target.getLayer().batchDraw();
      });
      this.tool.shape.on("transform dragmove", (e: KonvaEventObject<MouseEvent>) => {

        let target = e.target as Konva.Rect;
        if (e.type === "transform") {
          target.setAttrs({
            width: Math.round(target.width() * target.scaleX()),
            height: Math.round(target.height() * target.scaleY()),
            scaleX: 1,
          });
        }

        this.controls.width.value = target.width().toString();
        this.controls.height.value = target.height().toString();
        this.controls.x.value = target.x().toString();
        this.controls.y.value = target.y().toString();
      });

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