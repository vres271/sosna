import { Component } from '@angular/core';

@Component({
  selector: 'app-grid',
  standalone: true,
  imports: [],
  templateUrl: './grid.component.html',
  styleUrl: './grid.component.css'
})
export class GridComponent {

  grid: {color: string}[] = Array(200).fill(null).map(() => ({color: ''}));
  color: string = '#ffAE00';

  setColor(e: any) {
    this.color = e.target.value;
  }

  clickCell(cell: {color: string}) {
    cell.color = this.color;
  }

}
