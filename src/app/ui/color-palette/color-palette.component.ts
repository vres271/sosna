import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { paletteColors } from './colors';

@Component({
  selector: 'ui-color-palette',
  standalone: true,
  imports: [],
  templateUrl: './color-palette.component.html',
  styleUrl: './color-palette.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColorPaletteComponent {
  @Input() value = '';
  @Output() valueChange = new EventEmitter<string>();

  colors = paletteColors;

  selectColor(color: string) {
    this.valueChange.emit(color);
  }






}
