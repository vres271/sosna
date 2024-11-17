import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ButtonComponent } from '../../ui/button/button.component';

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
  imports: [ButtonComponent],
  templateUrl: './grid.component.html',
  styleUrl: './grid.component.css'
})
export class GridComponent implements OnInit{

  grid: IGVector[] = Array(200).fill(null).map(() => (
    {
      points: [],
      t: 0,
    }
  ));
  color: string = '#ffAE00';
  t: number = new Date().valueOf();

  constructor(
    private cd: ChangeDetectorRef
  ) {

  }

  ngOnInit() {
    const dt = 100;
    setInterval(() => {
      this.t = new Date().valueOf();
      this.grid?.forEach(v => v.t = v.t + dt);
      this.cd.detectChanges();
    }, dt);
  }

  setColor(e: any) {
    this.color = e.target.value;
  }

  clickCell(vector: IGVector, led: number) {

    const [r,g,b] = this.hexToRGB(this.color);

    vector.points.push({
      r,
      g,
      b,
      t: (vector.points?.length + 1) * 1000,
      timeFn: TimeFn.Step,
      orderFn: OrderFn.Linear,  
    })

    const ledsData = led + ':' + this.vectorToString(vector) + ';';
    const formData  = new FormData();
    formData.append('payload', ledsData);

    fetch('http://192.168.0.103/set', {
      method: 'POST',
      body: formData,
    })
      .then(res => res.json())
      .then(obj => console.log(obj))



  }

  onMouseEnter(vector: IGVector, i: number, e: MouseEvent) {
    if (e.buttons === 1) {
      this.clickCell(vector, i);
    }
  }

  clear() {
    fetch('http://192.168.0.103/clear', {
      method: 'POST',
      body: new FormData(),
    })
      .then(res => res.json())
      .then(obj => {
        console.log('cleared', obj);
        this.grid = Array(200).fill(null).map(() => (
          {
            points: [],
            t: 0,
          }
        ));
      })
  }

  hexToRGB(color: string): [number, number, number] {
    return [
      parseInt('0x'+this.color[1]+this.color[2]),
      parseInt('0x'+this.color[3]+this.color[4]),
      parseInt('0x'+this.color[5]+this.color[6]),    
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
