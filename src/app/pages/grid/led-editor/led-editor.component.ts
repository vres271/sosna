import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { IGPoint, ILed, OrderFn, TimeFn } from '../../../shared/model/leds';

@Component({
  selector: 'app-led-editor',
  standalone: true,
  imports: [],
  templateUrl: './led-editor.component.html',
  styleUrl: './led-editor.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LedEditorComponent {
  @Input() value!: ILed;
  @Input() color!: string;

  selectedPoint: IGPoint | null = null;

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

  onPointMove(e: MouseEvent, point: IGPoint | null) {
    if (!(e.target as HTMLElement).classList.contains('slider')) return;
    if (e.buttons !== 1 || !point) return;
    point.t = e.offsetX;
  }


  
}
