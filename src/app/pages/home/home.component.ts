import { Component } from '@angular/core';
import { ButtonComponent } from '../../ui/button/button.component';
import { RouterLink } from '@angular/router';
import { RouterPath } from '../../app.routes';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ButtonComponent, RouterLink],
  templateUrl: './home.component.html',
  styles: `
    .sosna-logo {
      background: url("/favicon.svg");
      height: 100%;
      width: 100%;
      background-size: contain;
      background-repeat: no-repeat;
      background-repeat: no-repeat;
      background-position: center center;
      cursor: pointer;
    }
  `
})
export class HomeComponent {

  RouterPath = RouterPath;

}
