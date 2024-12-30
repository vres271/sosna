import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { RouterPath } from './app.routes';
import { APIService } from './shared/services/api.service';
import { LocalStorageService } from './shared/services/local-storage.service';
import { ConfigService } from './shared/services/config.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  providers: [APIService, LocalStorageService, ConfigService],
  styles: [`
    .base-url {
      margin-left: auto;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {

  apiBaseURL = '';

  links = [
    {path: RouterPath.Home, title: 'Home'},
    {path: RouterPath.Grid, title: 'Grid'},
    {path: RouterPath.Settings, title: 'Настройки'},
  ];

  title = 'Sosna';

  constructor(private api: APIService) {
    this.apiBaseURL = api.baseURL;
  }


}
