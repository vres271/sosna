import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { LedsService } from '../../shared/services/leds.service';
import { APIService } from '../../shared/services/api.service';
import { APIMockService } from '../../mocks/services/apimock.service';

export interface IMode {
  id: number;
  name: string;
}

export const modes: IMode[] = [
  {id: 1, name: 'Sinus Warm'},
  {id: 2, name: 'Sinus Cold'},
  {id: 3, name: 'Sinus RGB'},
]

@Component({
  selector: 'app-modes',
  standalone: true,
  imports: [],
  providers: [APIMockService, APIService, LedsService],
  templateUrl: './modes.component.html',
  styleUrl: './modes.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModesComponent {

  modes = modes;
  selectedMode: IMode | null = null;

  constructor(
    private ledsService: LedsService,
    private cd: ChangeDetectorRef,
  ) { }

  setMode(mode: IMode) {
    this.ledsService.setMode(mode?.id).then(res => {
      if (res.result) {
        this.selectedMode = this.modes.find(m => m.id === +res.result) || null;
        this.cd.detectChanges();
      }
    });
  }

}
