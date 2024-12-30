import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'ui-input',
  standalone: true,
  imports: [],
  templateUrl: './input.component.html',
  styleUrl: './input.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputComponent {

  @Input() type?: 'text' | 'number' | 'email';
  @Input() disabled?: boolean;
  @Input() placeholder?: string = '';
  @Input() min?: number = 0;
  @Input() max?: number = 0;
  @Input() step?: number = 0;
  @Input() fullWidth = false;

  @Input() value!: number | string;
  @Output() valueChange = new EventEmitter<number | string>();

  // _value: number | string = '';

  onInput(e: Event) {
    this.value = (e.target as any)?.value ?? '';
    this.valueChange.emit(this.value);
  }

}
