import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";
import { IProperties, QuickProperty } from "./tools/QuickProperty";

export class App {
  private stage: Konva.Stage;
  private transformer: Konva.Transformer | null = null;
  private quickProperties: QuickProperty;
  private layers;
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

    this.stage.on("mousemove.draw", this.mouseMoveHandler.bind(this));
    this.stage.on("mousedown.stretch", this.stretchHandler.bind(this));
    this.stage.on("mouseup.stretch", () => {
      this.stage.off("mousemove.stretch");
    });
    // this.stage.on("mouseup.stretch", this.endStretch.bind(this));
    // this.stage.on("mousemove.stretch", this.toggleAnimation.bind(this));
    this.stage.on("click.select", (e) => {
      if (e.target != this.stage && !this.isAnimating) {
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
  private stretchHandler(e: KonvaEventObject<MouseEvent>): void {
    if (this.selected) {
      const regex = /^.*?(?:\b|_)middle(?:\b|_).*?(?:\b|_)anchor(?:\b|_).*?$/g; // Regex to findo if the shape IS a middle anchor
      const anchor = e.target.name().match(regex);
      if (anchor !== null) {
        const p2 = this.selected.width()
        if(this.selected.offsetX() == p2 || this.selected.offsetX() == 0){
          if (anchor.toString().search("left") > -1) {
            this.selected.scaleX(-1);
            this.selected.scaleY(-1);
            this.selected.move({ x: this.selected.width(), y: 0 });
          }else {
            
          }
        }
        console.log(this.selected.offsetX());

        this.stage.on("mousemove.stretch", (e: KonvaEventObject<MouseEvent>) => {        
          if (this.selected) {
            const pointer = {
              x: e.evt.offsetX,
              y: e.evt.offsetY,
            }
            const newP2 = this.calcRotation(pointer);
            this.updateShape(newP2.x, newP2.y);
          }
        });
      }
    }
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
          this.transformer?.destroy();
          this.quickProperties.hide();
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
      this.draw(e.target.getRelativePointerPosition());
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
  }): void {
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

    wall.on("dragmove transform", (e: KonvaEventObject<MouseEvent> ) => {
      if (this.selected) {
        let target = e.target as Konva.Rect;
        if (e.type === "transform") {
          this.selected.setAttrs({ 
            width: Math.round(target.width() * target.scaleX()), 
            height: Math.round(target.height() * target.scaleY()), 
            scaleX: 1, 
          }); 
        }
        this.quickProperties.update(this.getPropsFromShape(this.selected));
      }
    })
    
    this.addShape(wall);
  }

  private calcRotation(pointer: { x: number; y: number }) {
    if (this.selected) {
      const angle = this.selected.rotation() * Math.PI / 180; // convert to radians
      const hip = this.selected.width();
      const catOp = Math.sin(angle) * hip;
      const catAdj = Math.cos(angle) * hip;
      const half = this.selected.height() / 2;

      const deslocamento = (this.selected.y() + catOp - half) - pointer.y;

      const newCatOp = catOp + (-deslocamento);
      const p2 = {
        x: this.selected.x() + catAdj,
        y: this.selected.y() + newCatOp,
      }
      return p2;
    }
    return { x: 0, y: 0 };
  }

  private updateShape(x: number, y: number): void {
    if (this.selected) {
      
      const catAdj = x - this.selected.x(); 
      const catOp = y - this.selected.y();
      const hip = Math.sqrt(Math.pow(catAdj, 2) + Math.pow(catOp, 2));
      const angle = Math.atan2(catOp,catAdj) * 180 / Math.PI; // in degrees      
      // console.log(`Cateto Oposto: ${catOp} - Hipotenusa: ${catAdj} - Angle: ${angle}`);
      this.selected.width(hip);
      this.selected.rotation(angle);
      this.transformer?.rotation(angle);
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
    this.selectShape(wall);
    this.layers.drawing.batchDraw();
  }

  private unselectShape() {
    this.transformer?.destroy();
    this.layers.drawing.batchDraw();
    this.selected = null;
    this.quickProperties.hide();
  }

  private selectShape(shape: Konva.Rect) {
    this.unselectShape();
    this.selected = shape;
    this.selected.moveToTop();
    this.transformer = new Konva.Transformer({
      nodes: [this.selected],
      keepRatio: false,
      enabledAnchors: ['middle-right','middle-left'],
    });
     
     

    this.layers.drawing.add(this.transformer);
    this.quickProperties.show(this.getPropsFromShape(shape));
    this.quickPropertiesControlls();
  }

  private getPropsFromShape(shape: Konva.Rect): IProperties {
    return {
      x: shape.x(),
      y: shape.y(),
      length: Number(shape.width().toFixed(2)),
      angle: Number(shape.rotation().toFixed(2)),
      height: shape.height(),
    }
  }

  private mouseMoveHandler(e: KonvaEventObject<MouseEvent>): void {
    const { x, y } = e.currentTarget.getRelativePointerPosition();
    let mouseXOutput = document.querySelector('#mouseX');
    let mouseYOutput = document.querySelector('#mouseY');
    if (mouseXOutput && mouseYOutput) {
      mouseXOutput.innerHTML = "X: " + Math.round(x).toString();
      mouseYOutput.innerHTML = "Y: " + Math.round(y).toString();
    }
    if (this.isAnimating) {
      this.updateShape(x, y);
    }
  }

}