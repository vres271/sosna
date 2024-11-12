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
    console.log(      parseInt('0x'+cell.color[1]+cell.color[2]),
    parseInt('0x'+cell.color[3]+cell.color[4]),
    parseInt('0x'+cell.color[5]+cell.color[6]),

)
    fetch('http://192.168.0.103/get?led='+i+
      '&h='+parseInt('0x'+cell.color[1]+cell.color[2])+
      '&s='+parseInt('0x'+cell.color[3]+cell.color[4])+
      '&v='+parseInt('0x'+cell.color[5]+cell.color[6])+
      '')
      .then(res => res.json())
      .then(obj => console.log(obj))
  }




}
