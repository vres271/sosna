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

    // fetch('http://192.168.0.103/get?led='+i+
    //   '&r='+parseInt('0x'+cell.color[1]+cell.color[2])+
    //   '&g='+parseInt('0x'+cell.color[3]+cell.color[4])+
    //   '&b='+parseInt('0x'+cell.color[5]+cell.color[6])+
    //   '')
    //   .then(res => res.json())
    //   .then(obj => console.log(obj))

    const formData  = new FormData();
    // formData.append('led', '' + i);
    // formData.append('r', '' + parseInt('0x'+cell.color[1]+cell.color[2]));
    // formData.append('g', '' + parseInt('0x'+cell.color[3]+cell.color[4]));
    // formData.append('b', '' + parseInt('0x'+cell.color[5]+cell.color[6]));
    const [r,g,b] = [
      parseInt('0x'+cell.color[1]+cell.color[2]),
      parseInt('0x'+cell.color[3]+cell.color[4]),
      parseInt('0x'+cell.color[5]+cell.color[6]),    
    ]

    const ledsData = [
      `${i}:${r},${g},${b},1000,1,1|${r},${g-150},${b-150},2000,1,1|${r-150},${g},${b},2000,1,1;`,
      `${i+1}:${r-110},${g-120},${b},1500,1,1|${r},${g-140},${b-130},3000,1,1|${r-130},${g},${b},4000,1,1;`,
      `${i+2}:255,0,0,1000,1,1|0,255,0,2000,1,1|0,0,255,3000,1,1`,
      // `${i}:${r},${g-50},${b-50},2000,1,1;`,
      // `${i}:${r-50},${g},${b},2000,1,1;`,
    ]

    formData.append('payload', ledsData.join(''));

    fetch('http://192.168.0.103/set', {
      method: 'POST',
      body: formData,
    })
      .then(res => res.json())
      .then(obj => console.log(obj))



  }

  onMouseEnter(cell: {color: string}, i: number, e: MouseEvent) {
    if (e.buttons === 1) {
      this.clickCell(cell, i);
    }
  }


}
