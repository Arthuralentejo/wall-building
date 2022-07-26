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
    this.stage.on("click.select", (e) => {
      if (e.target != this.stage) {
        this.selectShape(e.target as Konva.Rect);
      } else {
        this.unselectShape();
      }
    });
    const container = this.stage.container();
    container.tabIndex = 1;
    container.focus()
    container.addEventListener("keydown", this.keyboardHandler.bind(this));
  }

  private quickPropertiesControlls() {
    const qpCard = this.quickProperties.qpCard;
    if (qpCard) {
      qpCard.querySelectorAll('.value').forEach((input) => {
        input.addEventListener('change', (e) => {
          const target = e.target as HTMLInputElement;
          let name = ''
          switch (target.name) {
            case "length":
              name = "width";
              break;
            case "angle":
              name = "rotation";
              break;
            default:
              name = target.name.toLowerCase();
              break;
          }
          const value = target.value;

          if (this.selected) {
            this.selected.setAttr(name, Number(value));
            this.layers.drawing.draw();
          }
        });
      });
    }
  }

  private keyboardHandler(e: KeyboardEvent) {
    const MOVE = 5;
    if (this.selected) {
      switch (e.key) {
        case "ArrowUp":
          this.selected.move({ x: 0, y: -MOVE });
          break;
        case "ArrowDown":
          this.selected.move({ x: 0, y: MOVE });
          break;
        case "ArrowLeft":
          this.selected.move({ x: -MOVE, y: 0 });
          break;
        case "ArrowRight":
          this.selected.move({ x: MOVE, y: 0 });
          break;
        case "Delete":
          this.selected.remove();
          break;
      }
      this.layers.drawing.batchDraw();
    }
  }

  private toggleTool(): void {
    this.isToolActive = !this.isToolActive;
    document.body.style.cursor = this.isToolActive ? "crosshair" : "default"
    if (this.isToolActive) {
      this.stage.on("click.tool", this.toggleAnimation.bind(this));
    } else {
      this.stage.off("click.tool");
    }
  }

  private toggleAnimation(e: KonvaEventObject<MouseEvent>): void {
    this.isAnimating = !this.isAnimating;
    if (this.isAnimating) {
      let shape = this.draw(e.target.getRelativePointerPosition());
      this.selectShape(shape);
    } else {
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
    const HEIGHT = 150;
    const wall = new Konva.Rect({
      height: HEIGHT,
      width: 1,
      x: location.x,
      y: location.y,
      offsetY: HEIGHT,
      fill: "lightblue",
      stroke: "blue",
      strokeWidth: .5,
      draggable: true,
    })
    wall.on("dragmove", () => {
      if (this.selected) {
        this.quickProperties.update(this.getPropsFromShape(this.selected));
      }
    })
    this.addShape(wall);
    return wall;
  }

  private updateShape(x: number, y: number): void {
    if (this.selected) {

      this.selected.setAttr("width", x - this.selected.x());
      this.selected.setAttr("rotation", (y - this.selected.y()) / 10);
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
    this.selected?.strokeWidth(.5);
    this.selected = null;
    this.quickProperties.hide();
  }

  private selectShape(shape: Konva.Rect) {
    this.unselectShape();
    this.selected = shape;
    this.selected.strokeWidth(3);
    this.selected.moveToTop();
    this.layers.drawing.batchDraw();
    this.quickProperties.show(this.getPropsFromShape(shape));
    this.quickPropertiesControlls();
  }

  private getPropsFromShape(shape: Konva.Rect): IProperties {
    return {
      x: shape.x(),
      y: shape.y(),
      length: shape.width(),
      angle: shape.rotation(),
      height: shape.height(),
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
    if (this.isAnimating) {
      this.updateShape(x, y);
    }
  }

}