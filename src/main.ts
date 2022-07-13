import './style.css'
import { App } from './app';
import { Controls } from './utils/Controls';

const controls = new Controls()
const app = new App(controls);
app.init();