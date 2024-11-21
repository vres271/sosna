import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ButtonComponent } from '../../ui/button/button.component';
import { InputComponent } from '../../ui/input/input.component';

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

@Component({
  selector: 'app-grid',
  standalone: true,
  imports: [ButtonComponent, InputComponent],
  templateUrl: './grid.component.html',
  styleUrl: './grid.component.css'
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
  clickMode: 'click' | 'check' = 'click';
  duration = 1000;

  get checkedCells() {
    return this.grid?.filter(cell => cell.checked)
  }

  constructor(
    private cd: ChangeDetectorRef
  ) {

  }

  ngOnInit() {
    const dt = 10;
    setInterval(() => {
      this.t = new Date().valueOf();
      this.grid?.forEach(cell => cell.vector.t = cell.vector.t + dt);
      this.cd.detectChanges();
    }, dt);
  }

  setColor(e: any) {
    this.color = e.target.value;
  }

  clickCell(cell: {vector: IGVector, checked: boolean}, led: number) {

    const {vector, checked} = cell;

    if (this.clickMode === 'check') {
      cell.checked = !cell.checked;
      return;
    }

    const [r,g,b] = this.hexToRGB(this.color);

    vector.points.push({
      r,
      g,
      b,
      t: (vector.points?.length + 1) * this.duration,
      timeFn: TimeFn.Step,
      orderFn: OrderFn.Linear,  
    })

    if (this.clickMode === 'click') {
      this.setLeds([{led, vector}]);
    }

  }

  setLeds(leds: {led: number, vector: IGVector}[]) {

    const ledsData = leds
      .map(item => item.led + ':' + this.vectorToString(item.vector))
      .join(';')
    const formData  = new FormData();
    formData.append('payload', ledsData);

    fetch('http://192.168.0.103/set', {
      method: 'POST',
      body: formData,
    })
      .then(res => res.json())
      .then(obj => console.log(obj))

  }

  onMouseEnter(cell: {vector: IGVector, checked: boolean}, i: number, e: MouseEvent) {
    if (e.buttons === 1) {
      this.clickCell(cell, i);
    }
  }

  setClickMode(e: Event) {
    this.clickMode = (e.target as any)?.value ?? '';
  }

  setChecked() {
    const leds = this.grid
      .filter(cell => cell.checked)
      .map((cell, led) => ({
        led,
        vector: cell.vector
      }))

    this.setLeds(leds);
  }

  clear() {
    fetch('http://192.168.0.103/clear', {
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

}
