import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { IGPoint, ILed, OrderFn, TimeFn } from '../../../shared/model/leds';
import { InputComponent } from '../../../ui/input/input.component';

@Component({
  selector: 'app-led-editor',
  standalone: true,
  imports: [InputComponent],
  templateUrl: './led-editor.component.html',
  styleUrl: './led-editor.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LedEditorComponent {
  @Input() value!: ILed;
  @Input() color!: string;

  sliderWidth = 500;

  selectedPoint: IGPoint | null = null;
  maxT = 5000;

  setMaxT(e: Event) {
    this.maxT = e.target ? parseInt((e.target as HTMLInputElement).value) : 5000;
  };

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

  delPoint(point: IGPoint) {
    console.log(point)
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
  }

  onSliderClick(e: MouseEvent) {
    if (!(e.target as HTMLElement).classList.contains('slider')) return;
    this.addPoint(e.offsetX);
  }

  selectPoint(point: IGPoint) {
    this.selectedPoint = point;
  }

  private get k() {
    return this.maxT / this.sliderWidth;
  }

  pixelsToTime(pixels: number) {
    return pixels * this.k;
  }

  timeToPixels(time: number) {
    return time / this.k;
  }

  getPointLeft(point: IGPoint) {
    return this.timeToPixels(point.t) + 'px';
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
  }

  onPointMove(e: MouseEvent, point: IGPoint | null) {
    if (!(e.target as HTMLElement).classList.contains('slider')) return;
    if (e.buttons !== 1 || !point) return;
    point.t = this.pixelsToTime(e.offsetX);
  }

  onTouchMove(e: TouchEvent, point: IGPoint | null) {
    if (!(e.target as HTMLElement).classList.contains('slider')) return;
    if (!point) return;
    point.t = this.pixelsToTime(e.touches[0].clientX);
  } 


  
}
