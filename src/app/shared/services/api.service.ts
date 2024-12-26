import { Injectable } from '@angular/core';

export enum APIMethod {
  Set = 'set',
  Clear = 'clear',
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

  private baseURL = 'http://192.168.0.104/';
  public isPending = false;

  constructor() { }

  query<T>(method: APIMethod, payload?: any): Promise<IAPIResponse<T>> {
    const formData  = new FormData();
    if (payload) {
      formData.append('payload', payload);
    }
    this.isPending = true;
    return fetch(this.baseURL+method, {
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
