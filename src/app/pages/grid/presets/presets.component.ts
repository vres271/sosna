import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { IPreset } from '../../../shared/model/presets';
import { PresetsService } from '../../../shared/services/presets.service';
import { InputComponent } from '../../../ui/input/input.component';
import { ILed } from '../../../shared/model/leds';
import { ButtonComponent } from '../../../ui/button/button.component';

@Component({
  selector: 'app-presets',
  standalone: true,
  imports: [InputComponent, ButtonComponent],
  templateUrl: './presets.component.html',
  styleUrl: './presets.component.css',
  providers: [PresetsService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PresetsComponent {

  @Input() leds: ILed[] = [];
  @Output() selectPreset = new EventEmitter<IPreset>();
  @Output() close = new EventEmitter();

  presets: IPreset[] = [];
  preset!: IPreset;

  constructor(
    private presetsService: PresetsService
  ) { }

  ngOnInit(): void {
    this.preset = this.presetsService.createPreset(`New preset ${new Date().toISOString()}`, this.leds);
    this.presets = this.presetsService.get();
  }

  onSelectPreset(preset: IPreset): void {
    this.selectPreset.emit(preset);
  }

  addPreset(): void {
    this.presetsService.add(this.preset);
    this.presets = this.presetsService.get();
    this.preset = this.presetsService.createPreset(`New preset ${new Date().toISOString()}`, this.leds);
  }

  deletePreset(preset: IPreset): void {
    this.presetsService.delete(preset.id);
    this.presets = this.presetsService.get();
  }

  onClose(): void {
    this.close.emit();
  }

}
