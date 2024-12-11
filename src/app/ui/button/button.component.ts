import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { UIEvent, UIRole } from '../types';

@Component({
  selector: 'ui-button',
  standalone: true,
  imports: [],
  templateUrl: './button.component.html',
  styleUrl: './button.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {

  @Input() label?: string;
  @Input() disabled?: boolean;
  @Input() role: UIRole = 'default';
  @Input() compact = false;

  @Output() onClick = new EventEmitter<UIEvent<undefined, MouseEvent>>;

  constructor(
    private cd: ChangeDetectorRef
  ) {}

  clickHandler(originalEvent: MouseEvent) {
    this.onClick.emit({
      originalEvent
    })
  }

  disable() {
    this.disabled = true;
    this.cd.detectChanges();
  }

  enable() {
    this.disabled = false;
    this.cd.detectChanges();
  }

}
