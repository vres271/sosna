import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { IGPoint, ILed, OrderFn, TimeFn } from '../../../shared/model/leds';
import { InputComponent } from '../../../ui/input/input.component';
import { ButtonComponent } from '../../../ui/button/button.component';

@Component({
  selector: 'app-led-editor',
  standalone: true,
  imports: [InputComponent, ButtonComponent],
  templateUrl: './led-editor.component.html',
  styleUrl: './led-editor.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LedEditorComponent implements OnChanges, AfterViewInit{
  @Input() led!: ILed;
  @Output() valueChange = new EventEmitter<ILed>();
  @Input() color!: string;
  @ViewChild('timeLine') timeLine!: ElementRef;
  value!: ILed;

  sliderWidth = 500;
  markerWidth = 24;

  selectedPoint: IGPoint | null = null;
  maxT = 5000;

  constructor(private cd: ChangeDetectorRef) {}

  ngAfterViewInit() {
    this.sliderWidth = this.timeLine.nativeElement.clientWidth;
    this.cd.detectChanges();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['value']) {
      this.selectedPoint = null;
    }
    if (changes['led']) {
      this.value = JSON.parse(JSON.stringify(this.led));
    }
  }

  getStyleColor(point: IGPoint | undefined) {
    return point ? `rgb(${point.r},${point.g},${point.b})` : '';
  }

  hexToRGB(color: string): [number, number, number] {
    return [
      parseInt('0x'+color[1]+color[2]),
      parseInt('0x'+color[3]+color[4]),
      parseInt('0x'+color[5]+color[6]),    
    ]
  }

  addPoint(t: number) {
    const [r,g,b] = this.hexToRGB(this.color);
    const point: IGPoint = {
      r,
      g,
      b,
      t,
      timeFn: TimeFn.Step,
      orderFn: OrderFn.Linear,
    }
    this.value.vector.points.push(point);
    this.value.vector.points.sort((a,b) => a.t - b.t);
    this.selectPoint(point);
    this.valueChange.emit(this.value);
  }

  onMaxTChange() {
    const lastPoint = this.value.vector.points[this.value.vector.points.length - 1];
    if (lastPoint && this.maxT < lastPoint.t) {
      const k = this.maxT / lastPoint.t;
      this.value.vector.points.forEach(p => p.t *= k);
    }
    this.valueChange.emit(this.value);
  }

  onTimeOffsetChange(value: number | string) {
    this.value.vector.timeOffset = +value;
    this.valueChange.emit(this.value);
  }

  onSliderClick(e: MouseEvent) {
    if (!(e.target as HTMLElement).classList.contains('slider')) return;
    const t = this.pixelsToTime(e.offsetX);
    const intersection = this.value.vector.points.some(p => Math.abs(p.t - t) < this.pixelsToTime(this.markerWidth/2));
    if (intersection) return;
    this.addPoint(t);
  }

  selectPoint(point: IGPoint) {
    this.selectedPoint = point;
  }

  private get k() {
    return this.maxT / this.sliderWidth;
  }

  pixelsToTime(pixels: number) {
    return Math.round(pixels * this.k);
  }

  timeToPixels(time: number) {
    return Math.round(time / this.k);
  }

  getPointLeft(point: IGPoint) {
    return (this.timeToPixels(point.t) - this.markerWidth / 2) + 'px';
  }

  getPointColor(point: IGPoint) {
    if (!point) return '#000000';
    const {r, g, b} = point;
    return '#' + [r, g, b].map(x => {
      const hex = x.toString(16)
      return hex.length === 1 ? '0' + hex : hex
    }).join('')
  }

  setPointColor(point: IGPoint, event: Event) {
    const [r,g,b] = this.hexToRGB(event.target ? (event.target as HTMLInputElement).value : '');
    point.r = r;
    point.g = g;
    point.b = b;
    this.valueChange.emit(this.value);
  }

  onPointMove(e: MouseEvent, point: IGPoint | null) {
    if (!(e.target as HTMLElement).classList.contains('slider')) return;
    if (e.buttons !== 1 || !point) return;
    this.movePointTime(point, e.offsetX);
  }

  onTouchMove(e: TouchEvent, point: IGPoint | null) {
    if (!point) return;
    this.movePointTime(point, Math.round(e.touches[0].clientX - this.markerWidth));
  } 

  movePointTime(point: IGPoint, pixels: number) {
    const t = this.pixelsToTime(pixels);
    const i = this.value.vector.points.indexOf(point);
    if (t > this.maxT) return;
    const next = this.value.vector.points[i+1];
    if (next && t > point.t && t >= next.t) return;
    if (t < 0) return;
    const prev = this.value.vector.points[i-1];
    if (prev && t < point.t && t <= prev.t) return;
    point.t = t;
    this.valueChange.emit(this.value);
  }

  deletePoint(point: IGPoint) {
    this.value.vector.points = this.value.vector.points.filter(p => p !== point);
    this.selectedPoint = null;
    this.valueChange.emit(this.value);
  }

}
