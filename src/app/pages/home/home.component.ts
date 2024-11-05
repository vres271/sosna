import { Component } from '@angular/core';
import { ButtonComponent } from '../../ui/button/button.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ButtonComponent],
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
    }
  `
})
export class HomeComponent {

}
