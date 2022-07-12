import './style.css'
import Konva from 'konva';
import { RectTool } from './rectTool';

const stage = new Konva.Stage({
  container: 'canva-holder',
  width: window.innerWidth,
  height: window.innerHeight,
});
RectTool.init(stage);