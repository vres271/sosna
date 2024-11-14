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

  clickCell(cell: {color: string}, i: number) {
    cell.color = this.color;
    fetch('http://192.168.0.103/get?led='+i+
      '&r='+parseInt('0x'+cell.color[1]+cell.color[2])+
      '&g='+parseInt('0x'+cell.color[3]+cell.color[4])+
      '&b='+parseInt('0x'+cell.color[5]+cell.color[6])+
      '')
      .then(res => res.json())
      .then(obj => console.log(obj))
  }

  onMouseEnter(cell: {color: string}, i: number, e: MouseEvent) {
    if (e.buttons === 1) {
      this.clickCell(cell, i);
    }
  }


}
