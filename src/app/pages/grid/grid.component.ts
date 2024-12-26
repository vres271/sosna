import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ButtonComponent } from '../../ui/button/button.component';
import { InputComponent } from '../../ui/input/input.component';
import { LedsComponent, SelectMode } from './leds/leds.component';
import { APIMockService } from '../../mocks/services/apimock.service';
import { APIService } from '../../shared/services/api.service';
import { LedsService } from '../../shared/services/leds.service';
import { IGPoint, IGVector, ILed, OrderFn, TimeFn } from '../../shared/model/leds';
import { ColorPaletteComponent } from '../../ui/color-palette/color-palette.component';
import { LedEditorComponent } from './led-editor/led-editor.component';


@Component({
  selector: 'app-grid',
  standalone: true,
  imports: [ButtonComponent, InputComponent, LedsComponent, ColorPaletteComponent, LedEditorComponent],
  templateUrl: './grid.component.html',
  styleUrl: './grid.component.css',
  providers: [APIMockService, APIService, LedsService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class GridComponent implements OnInit{

  color: string = '#ffAE00';
  t: number = new Date().valueOf();
  duration = 1000;
  leds: ILed[] = [];
  selectedLeds: ILed[] = [];

  SelectMode = SelectMode;
  selectMode = SelectMode.Click;

  selectModesDict = [
    {mode: SelectMode.Click, label: 'Sel'},
    {mode: SelectMode.ClickMulty, label: 'SelM'},
    {mode: SelectMode.Paint, label: 'Draw'},
    {mode: SelectMode.Send, label: 'Send'},
  ]

  isPaletteVisible = false;

  constructor(
    private cd: ChangeDetectorRef,
    private ledsService: LedsService
  ) {

  }

  private createLeds() {
    return Array(200).fill(null).map((item, i) => this.createLed(i))
  }

  private createLed(i: number): ILed {
    return {
      ledIndex: i,
      vector: this.createVector()
    }
  }

  private createVector(): IGVector {
    return {
      points: [],
      t: 0,
    }
  }

  ngOnInit() {
    this.leds =  this.createLeds();
  }

  onLedClick(led: ILed) {
    const {vector} = led;
    const [r,g,b] = this.hexToRGB(this.color);

    switch (this.selectMode) {
      case SelectMode.None:
      case SelectMode.ClickMulty:
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
    this.isPaletteVisible = false;
  }

  sendLeds(leds: ILed[]) {
    if (this.ledsService.isPending) return;
    this.ledsService.set(leds)
      .then(res => console.log(res));
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

  sendClear(btn: ButtonComponent) {

    btn.disable();
    this.ledsService.clear().then(res => {
      this.leds = this.createLeds();
      btn.enable();
      this.cd.detectChanges();
    })
  }

  hexToRGB(color: string): [number, number, number] {
    return [
      parseInt('0x'+color[1]+color[2]),
      parseInt('0x'+color[3]+color[4]),
      parseInt('0x'+color[5]+color[6]),    
    ]
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

  delPoint(led: ILed, point: IGPoint) {
    led.vector.points = led.vector.points.filter(p => p !== point);
    this.selectedLeds.forEach(sl => sl.vector = led.vector);
    this.cd.detectChanges();
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
