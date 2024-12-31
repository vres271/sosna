import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { LedsService } from '../../shared/services/leds.service';

export interface IMode {
  id: number;
  name: string;
}

// export const modes: IMode[] = [
//   {id: 1, name: 'Sinus Warm'},
//   {id: 2, name: 'Sinus Cold'},
//   {id: 3, name: 'Sinus RGB'},
// ]

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
    this.ledsService.getModes().then(res => {
      if (res.result) {
        this.modes = res.result?.modes;
        const mode = res.result?.mode;
        this.selectedMode = this.modes.find(m => m.id === mode) || null;
        this.isLoading = false;
        this.cd.detectChanges();
      }
    })
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
