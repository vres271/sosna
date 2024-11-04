import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
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

  @Output() onClick = new EventEmitter<UIEvent<undefined, MouseEvent>>;

  clickHandler(originalEvent: MouseEvent) {
    this.onClick.emit({
      originalEvent
    })
  }

}
