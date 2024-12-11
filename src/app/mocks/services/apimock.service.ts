import { Injectable } from '@angular/core';

@Injectable()
export class APIMockService {

  constructor() { }

  private query(method: string, payload: FormData) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({result: 'ok', method})
      },1000)
    })
  }

  set(payload: FormData) {
    return this.query('set', payload)
  }

  clear() {
    return this.query('clear', new FormData)
  }

}
