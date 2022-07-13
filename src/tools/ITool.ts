import Konva from "konva";
import { ShapeConfig } from "konva/lib/Shape";

export interface ITool {
  name: string;
  active: boolean;
  button: Konva.Shape;
  shape?: Konva.Shape;
  eraseDrawing(): void;
  draw(config: ShapeConfig): Konva.Shape;
  updateShape(config: ShapeConfig): void;
}