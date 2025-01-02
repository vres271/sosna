import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { InputComponent } from '../../ui/input/input.component';
import { ConfigService } from '../../shared/services/config.service';
import { ButtonComponent } from '../../ui/button/button.component';
import { LedsService } from '../../shared/services/leds.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [InputComponent, ButtonComponent],
  templateUrl: './settings.component.html',
  providers: [ConfigService, LedsService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent {

  detectAddressResult = '';
  detectAddressResultColor = '';

  constructor(
    private configService: ConfigService,
    private ledsService: LedsService,
    private cd: ChangeDetectorRef,
  ) {}

  get baseURL(): string {
    return this.configService.get().baseURL;
  }

  set baseURL(value: string) {
    this.configService.set({baseURL: value});
  }

  autoDetectAddress() {
    this.detectAddressResult = 'pending...';
    this.detectAddressResultColor = '';
    this.cd.detectChanges();
    this.ledsService.testAddr(this.baseURL).then(res => {
      this.detectAddressResult = JSON.stringify(res?.result);
      if ((res?.result as any)?.device === 'sosna') {
        this.detectAddressResultColor = 'green'
      }
      this.cd.detectChanges();
      console.log('autoDetectAddress', res)
    }).catch(err => {
      this.detectAddressResult = 'ERROR: ' + JSON.stringify(err);
      this.detectAddressResultColor = 'tomato'
      this.cd.detectChanges();
      console.log('autoDetectAddress error', err)
      
    });
  }

}
