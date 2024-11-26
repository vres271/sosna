import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ButtonComponent } from '../../ui/button/button.component';
import { InputComponent } from '../../ui/input/input.component';
import { LedsComponent, SelectMode } from './leds/leds.component';

export enum TimeFn {
  Empty,
  Step,
  Gradient
}

export enum OrderFn {
  Empty,
  Linear,
  Random
}

export interface IGPoint {
  r: number;
  g: number;
  b: number;
  t: number;
  timeFn: TimeFn;
  orderFn: OrderFn;
}

export interface IGVector {
  points: IGPoint[];
  t: number;
}

export interface ILed {
  ledIndex: number;
  vector: IGVector;
}

@Component({
  selector: 'app-grid',
  standalone: true,
  imports: [ButtonComponent, InputComponent, LedsComponent],
  templateUrl: './grid.component.html',
  styleUrl: './grid.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class GridComponent implements OnInit{

  grid: {
    vector: IGVector,
    checked: boolean,
  }[] = Array(200).fill(null).map(() => ({
    vector: {
      points: [],
      t: 0,
    },
    checked: false
  }));
  color: string = '#ffAE00';
  t: number = new Date().valueOf();
  duration = 1000;
  leds: ILed[] = [];
  selectedLeds: ILed[] = [];

  SelectMode = SelectMode;
  selectMode = SelectMode.Send;


  get checkedCells() {
    return this.grid?.filter(cell => cell.checked)
  }

  constructor(
    private cd: ChangeDetectorRef
  ) {

  }

  ngOnInit() {
    this.leds  =  this.grid.map((item, i) => ({
      ledIndex: i,
      vector: item.vector,
    }))
  }

  onLedClick(led: ILed) {
    const {vector} = led;
    const [r,g,b] = this.hexToRGB(this.color);

    switch (this.selectMode) {
      case SelectMode.None:
        
        break;
      case SelectMode.Click:
        break;
      case SelectMode.Paint:
        vector.points.push({
          r, g, b,
          t: (vector.points?.length + 1) * this.duration,
          timeFn: TimeFn.Step,
          orderFn: OrderFn.Linear,  
        })
        this.leds[led.ledIndex] = {
          ...led
        }        
        break;
      case SelectMode.Send:
        vector.points.push({
          r, g, b,
          t: (vector.points?.length + 1) * this.duration,
          timeFn: TimeFn.Step,
          orderFn: OrderFn.Linear,  
        })
        this.leds[led.ledIndex] = {
          ...led
        }        
        this.sendLeds([led]);
        break;
    
      default:
        break;
    }

  }

  setColor(e: any) {
    this.color = e.target.value;
  }

  sendLeds(leds: ILed[]) {
    const ledsData = leds
      .map(led => led.ledIndex + ':' + this.vectorToString(led.vector))
      .join(';')
    const formData  = new FormData();
    formData.append('payload', ledsData);
  
    fetch('http://192.168.0.104/set', {
      method: 'POST',
      body: formData,
    })
      .then(res => res.json())
      .then(obj => console.log(obj))

  }

  onMouseEnter(cell: {vector: IGVector, checked: boolean}, i: number, e: MouseEvent) {
    if (e.buttons === 1) {
      // this.clickCell(cell, i);
    }
  }

  setClickMode(e: Event) {
    this.selectMode = (e.target as any)?.value ?? '';
  }

  setChecked() {
    this.selectedLeds.forEach(led => {
      const {vector} = led;
      const [r,g,b] = this.hexToRGB(this.color);
      vector.points.push({
        r, g, b,
        t: (vector.points?.length + 1) * this.duration,
        timeFn: TimeFn.Step,
        orderFn: OrderFn.Linear,  
      })
      this.leds[led.ledIndex] = {
        ...led
      }        
    })
  }

  setClear() {
    this.selectedLeds.forEach(led => {
      led.vector = {
        points: [],
        t: 0,
      },
      this.leds[led.ledIndex] = {
        ...led
      }        
    })
  }

  sendChecked() {
    this.sendLeds(this.selectedLeds);
  }

  sendClear() {
    fetch('http://192.168.0.104/clear', {
      method: 'POST',
      body: new FormData(),
    })
      .then(res => res.json())
      .then(obj => {
        console.log('cleared', obj);
        this.grid = Array(200).fill(null).map(() => ({
          vector: {
            points: [],
            t: 0,
          },
          checked: false,
        }));
      })
  }

  hexToRGB(color: string): [number, number, number] {
    return [
      parseInt('0x'+color[1]+color[2]),
      parseInt('0x'+color[3]+color[4]),
      parseInt('0x'+color[5]+color[6]),    
    ]
  }

  pointToString(p: IGPoint) {
    return `${p.r},${p.g},${p.b},${p.t},${p.timeFn},${p.orderFn}`;
  }

  vectorToString(vector: IGVector) {
    return vector.points.map(this.pointToString).join('|');
  }

  getCurrentPoint(vector: IGVector | undefined) {
    if (!vector || !vector?.points.length) return;
    const firstPoint = vector.points[0];
    const lastPoint = vector.points[vector.points.length - 1];
    if (vector.t >= lastPoint.t) {
      vector.t = 0;
      return lastPoint
    };
    if (vector.t < firstPoint.t) return lastPoint;
    return vector.points.find((p, i, arr) => (p.t <= vector.t && vector.t < arr[i + 1].t))
  }

  getStyleColor(point: IGPoint | undefined) {
    return point ? `rgb(${point.r},${point.g},${point.b})` : '';
  }

  getVectorCurrentColor(vector: IGVector | undefined) {
    if (!vector?.points?.length) return '';
    const point = this.getCurrentPoint(vector);
    return this.getStyleColor(point);
  }

  get now() {
    return new Date().getMilliseconds();
  }


}
