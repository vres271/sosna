import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';

export enum APIMethod {
  Set = 'set',
  Clear = 'clear',
  SetMode = 'setmode',
  GetModes = 'getmodes',
}

export interface IAPIResponse<T> {
  result: T;
}

export interface IAPIService {
  isPending: boolean;
  query<T>(method: APIMethod, payload?: any): Promise<IAPIResponse<T>>
}

@Injectable()
export class APIService implements IAPIService{

  public baseURL = 'http://192.168.0.102';
  public isPending = false;

  constructor(
    private configService: ConfigService
  ) {
    const config = this.configService.get();
    this.baseURL = config.baseURL;
    console.log(777)
  }

  query<T>(method: APIMethod, payload?: any): Promise<IAPIResponse<T>> {
    const formData  = new FormData();
    if (payload) {
      formData.append('payload', payload);
    }
    this.isPending = true;
    return fetch(`${this.baseURL}/${method}`, {
      method: 'POST',
      body: formData,
      // mode: 'cors',
      // headers: {
      //   'Access-Control-Request-Private-Network': 'true'
      // }
    })
      .finally(() => {
        this.isPending = false;
      })
      .then(res => {
        return res.json();
      })
  }

}
