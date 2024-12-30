import { ChangeDetectionStrategy, Component } from '@angular/core';
import { InputComponent } from '../../ui/input/input.component';
import { ConfigService } from '../../shared/services/config.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [InputComponent],
  templateUrl: './settings.component.html',
  providers: [ConfigService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent {

  constructor(private configService: ConfigService) {}

  get baseURL(): string {
    return this.configService.get().baseURL;
  }

  set baseURL(value: string) {
    this.configService.set({baseURL: value});
  }

}
