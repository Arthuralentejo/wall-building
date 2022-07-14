import { IControls, IControlValues } from "./IControls";

export class Controls implements IControls {
  
  form: HTMLFormElement;
  width: HTMLInputElement;
  height: HTMLInputElement;
  x: HTMLInputElement;
  y: HTMLInputElement;
  drawButton: HTMLButtonElement;
  eraseButton: HTMLButtonElement;
  
  constructor() {
    this.width = <HTMLInputElement>document.querySelector('#widthInput');
    this.height = <HTMLInputElement>document.querySelector('#heightInput');
    this.x = <HTMLInputElement>document.querySelector('#xInput');
    this.y = <HTMLInputElement>document.querySelector('#yInput');
    this.drawButton = <HTMLButtonElement>document.querySelector('#drawBtn');
    this.eraseButton = <HTMLButtonElement>document.querySelector('#eraseBtn');
    this.form = <HTMLFormElement>document.querySelector('#controls');
  }
  
  getControlsValues(): IControlValues {
    return {
      width: Number(this.width.value),
      height: Number(this.height.value),
      x: Number(this.x.value),
      y: Number(this.y.value),
    };
  }

  setControlsValues(values: IControlValues): void {
    this.width.value = values.width.toString();
    this.height.value = values.height.toString();
    this.x.value = values.x.toString();
    this.y.value = values.y.toString();
  }

}