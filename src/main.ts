import './style.css'
import { App } from './app';
const drawbtn = document.querySelector('#drawBtn');
const widthInput = <HTMLInputElement> document.querySelector('#widthInput');
const heightInput = <HTMLInputElement> document.querySelector('#heightInput');
const xInput = <HTMLInputElement> document.querySelector('#xInput');
const yInput = <HTMLInputElement> document.querySelector('#yInput');


const app = new App();
app.init();


drawbtn?.addEventListener('click', (e) => {
  e.preventDefault();  
  const config = {
    x: Number(xInput?.value),
    y: Number(yInput?.value),
    width: Number(widthInput?.value),
    height:Number(heightInput?.value),
  };
  app.draw(config);
});

