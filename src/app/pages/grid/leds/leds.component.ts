import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { IGPoint, IGVector, ILed } from '../grid.component';
import { LedComponent } from './led/led.component';
import { ButtonComponent } from '../../../ui/button/button.component';

export enum SelectMode {
  None = 'None',
  Click = 'Click',
  Paint = 'Paint',
  Send = 'Send',
} 

export interface ILedBlock {
  led: ILed,
  checked: boolean
}

@Component({
  selector: 'app-leds',
  standalone: true,
  imports: [LedComponent, ButtonComponent],
  templateUrl: './leds.component.html',
  styleUrl: './leds.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class LedsComponent implements OnChanges, OnInit{
  @Input() leds: ILed[] = [];
  @Input() selectMode: SelectMode = SelectMode.Click;
  @Input() selected: ILed[] = [];

  @Output() ledClick = new EventEmitter<ILed>();
  @Output() selectedChange = new EventEmitter<ILed[]>();

  blocks: ILedBlock[] = [];

  constructor(
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['leds']) {
      this.blocks = changes['leds'].currentValue?.map(this.ledToBlock);
    }
    if (changes['selected']) {
    }
  }

  private ledToBlock(led: ILed):ILedBlock {
    return {
      led,
      checked: false,
    }
  }

  clickCell(block: ILedBlock) {
    this.ledClick.emit(block.led);
    switch (this.selectMode) {
      case SelectMode.None:
        
        break;
      case SelectMode.Click:
        block.checked = !block.checked;
        this.setSelected();
        break;
      case SelectMode.Paint:
        
        break;
    
      default:
        break;
    }

  }

  setSelected() {
    this.selected = this.blocks?.filter(b => b.checked).map(b => b.led);
    this.selectedChange.emit(this.selected);
  }

  selectAll() {
    this.blocks?.forEach(b => b.checked = true);
    this.setSelected();
  }

  inverseSelection() {
    this.blocks?.forEach(b => b.checked = !b.checked);
    this.setSelected();
  }

  selectNone() {
    this.blocks?.forEach(b => b.checked = false);
    this.setSelected();
  }


  onMouseEnter(cell: any, i: any, $event: any) {
    
  }

  get now() {
    return new Date().getMilliseconds();
  }

}
