import { Injectable } from '@angular/core';

@Injectable()
export class LocalStorageService {

  private storage: Storage = window.localStorage;

  constructor() {}

  get(key: string): any {
    const str = this.storage?.getItem(key);
    if (str) {
      return JSON.parse(str);
    }
  }

  set(key: string, value: any): void {
    this.storage?.setItem(key, JSON.stringify(value));
  }

}
