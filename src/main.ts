import './style.css'
import Konva from 'konva';
// const app = document.querySelector<HTMLDivElement>('#app')!

// app.innerHTML = `
//   <h1>Hello Vite!</h1>
//   <a href="https://vitejs.dev/guide/features.html" target="_blank">Documentation</a>
// `

const stage = new Konva.Stage({
  container: 'canva-holder',
  width: 500,
  height: 500,
});


const layer = new Konva.Layer();
stage.add(layer);
let rect = new Konva.Rect({
  x: 100,
  y: 100,
  fill: "blue",
  width: 200,
  height: 100,
  stroke: "orange",
  strokeWidth: 12,
  cornerRadius: 12,
  draggable:true
})
layer.add(rect)
layer.draw()