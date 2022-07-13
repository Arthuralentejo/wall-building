import Konva from "konva";
import { ShapeConfig } from "konva/lib/Shape";

export interface ITool {
  name: string;
  isActive: boolean;
  isDrawing: boolean;
  icon: Konva.Shape;
  shape?: Konva.Shape;
  eraseDrawing(): void;
  draw(config: ShapeConfig): void;
  startDraw(e: Konva.KonvaEventObject<MouseEvent>): void;
  drawing(e: Konva.KonvaEventObject<MouseEvent>): void;
  endDraw(e: Konva.KonvaEventObject<MouseEvent>): void;
  updateShape(config: ShapeConfig): void;
}