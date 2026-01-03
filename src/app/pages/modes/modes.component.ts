import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { LedsService } from '../../shared/services/leds.service';

export interface IMode {
  id: number;
  name: string;
}

export const modes: IMode[] = [
  // {id: 1, name: 'Sinus Warm'},
  // {id: 2, name: 'Sinus Cold'},
  // {id: 3, name: 'Sinus RGB'},

  {id: 1, name: 'sinus1'},
  {id: 2, name: 'sinus2'},
  {id: 3, name: 'sinus3'},
  {id: 4, name: 'purpleWave'},
  {id: 5, name: 'cyanRush'},
  {id: 6, name: 'sunsetGlow'},
  {id: 7, name: 'softPink'},
  {id: 8, name: 'emeraldGreen'},
  {id: 9, name: 'rainbowFrenzy'},
  {id: 10, name: 'lavenderDawn'},
  {id: 11, name: 'icyBlue'},
  {id: 12, name: 'magicalMagenta'},
  {id: 13, name: 'neonShock'},
  {id: 14, name: 'forestMoss'},
  {id: 15, name: 'flowerRomance'},

]

@Component({
  selector: 'app-modes',
  standalone: true,
  imports: [],
  providers: [LedsService],
  templateUrl: './modes.component.html',
  styleUrl: './modes.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModesComponent implements OnInit{

  modes: IMode[] = [];
  selectedMode: IMode | null = null;
  isLoading = false;

  constructor(
    private ledsService: LedsService,
    private cd: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.isLoading = true;
    // this.ledsService.getModes().then(res => {
    const res = {
      result: { modes, mode: 1 }
    }
    if (res.result) {
      this.modes = res.result?.modes;
      const mode = res.result?.mode;
      this.selectedMode = this.modes.find(m => m.id === mode) || null;
      this.isLoading = false;
      this.cd.detectChanges();
    }
    // })
  }

  setMode(mode: IMode | null) {
    if (mode) {
      this.ledsService.setMode(mode?.id).then(res => {
        if (res.result) {
          this.selectedMode = mode;
          this.cd.detectChanges();
        }
      });
    }
    this.selectedMode = mode;
  }

}
