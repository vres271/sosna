import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { IGPoint, IGVector, ILed } from '../../../../shared/model/leds';

@Component({
  selector: 'app-led',
  standalone: true,
  imports: [],
  templateUrl: './led.component.html',
  styleUrl: './led.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LedComponent implements OnInit, OnChanges{
  @Input() led!: ILed;
  @Input() checked = false;
  @Output() ledClick = new EventEmitter<ILed>();


  t = 0;

  constructor(
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.iterateVectors()
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  onLedClick(e: MouseEvent, led: ILed) {
    e.preventDefault();
    this.ledClick.emit(led);
  }

  onMouseEnter(e: MouseEvent, led: ILed) {
    e.preventDefault();
    if (e.buttons === 1) {
      this.ledClick.emit(led);
    }    
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

  getVectorCurrentColor(vector: IGVector) {
    const points = vector?.points;
    if (!points?.length) return '';
    const duration = points[points.length - 1].t;
    const t1 = this.t % duration;
    const next = points.find(p => p.t > t1) || points[0];
    const prev = points[points.indexOf(next) - 1] || points[points.length - 1];
    const dt = next.t - prev.t;
    const dt1 = Math.abs(t1 - prev.t);
    const k = dt1 / dt;
    const r = Math.round(prev.r + (next.r - prev.r) * k);
    const g = Math.round(prev.g + (next.g - prev.g) * k);
    const b = Math.round(prev.b + (next.b - prev.b) * k);
    return `rgb(${r},${g},${b})`;
  }

  getVectorCurrentColorOld(vector: IGVector | undefined) {
    if (!vector?.points?.length) return '';
    const point = this.getCurrentPoint(vector);
    return this.getStyleColor(point);
  }

  get now() {
    return new Date().getMilliseconds();
  }

  iterateVectors() {
    const dt = 10;
    setInterval(() => {
      if (this.led?.vector?.points?.length) {
        this.t = new Date().valueOf();
        this.led.vector.t = this.led.vector.t + dt;
      }
      this.cd.detectChanges();
    }, dt);
  }

}
