import './style.css'
import Konva from 'konva';
import { KonvaEventObject } from 'konva/lib/Node';

const stage = new Konva.Stage({
  container: 'canva-holder',
  width: 600,
  height: 600,
});

const layer = new Konva.Layer().moveTo(stage);
let rect: Konva.Rect | null = null;
let isNowDrawing = false

stage.on("mousedown", mousedownHandler)
stage.on("mousemove", mousemoveHandler)
stage.on("mouseup", mouseupHandler)

function mousedownHandler(e: KonvaEventObject<MouseEvent> ){
  
  isNowDrawing = true;
  rect = new Konva.Rect({
    x: e.currentTarget.getRelativePointerPosition().x,
    y: e.currentTarget.getRelativePointerPosition().y,
    fill: "lightblue",
    stroke: "blue",
  });

  layer.add(rect).batchDraw();
}
function mousemoveHandler(e){
  if(!isNowDrawing) return false;

  const newWidth = e.currentTarget.getRelativePointerPosition().x - rect.x();
  const newHeight = e.currentTarget.getRelativePointerPosition().y - rect.y();
  rect.width(newWidth);
  rect.height(newHeight);
  layer.batchDraw();
}
function mouseupHandler(){
  isNowDrawing = false;
}











// stage.on('click',drawRect)
// function drawRect(e) {
//   if (drawning) {
//     const rect = new Konva.Rect({
//       x: stage.getPointerPosition().x,
//       y: stage.getPointerPosition().y,
//       width: 100,
//       height: 100,
//       fill: '#00D0FF',
//       stroke: '#00D0FF',
//       strokeWidth: 5,
//     });
//     layer.add(rect);
//     stage.batchDraw();
//   }
// }