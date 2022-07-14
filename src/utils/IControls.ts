export interface IControlValues {
  width: number;
  height: number;
  x: number;
  y: number;  
}

export interface IControls {
  width: HTMLInputElement;
  height: HTMLInputElement;
  x: HTMLInputElement;
  y: HTMLInputElement;
  drawButton: HTMLButtonElement;
  eraseButton: HTMLButtonElement;
  form: HTMLFormElement;
  getControlsValues(): IControlValues;
  setControlsValues(values: IControlValues): void;
}