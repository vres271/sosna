import { Injectable } from '@angular/core';
import { LocalStorageService } from './local-storage.service';

export interface IConfig {
  baseURL: string;
}

export const defaultConfig: IConfig = {
  baseURL: 'http://192.168.0.102'
}

@Injectable()
export class ConfigService {

  constructor(
    private localStorageService: LocalStorageService,
  ) { }

  get(): IConfig {
    return this.localStorageService.get('config') || defaultConfig;
  }

  set(config: IConfig) {
    this.localStorageService.set('config', config);
  }

}
