import { Injectable } from '@angular/core';

export enum APIMethod {
  Set = 'set',
  Clear = 'clear',
}

export interface IAPIResponse<T> {
  result: T;
}

export interface IAPIService {
  query<T>(method: APIMethod, payload?: any): Promise<IAPIResponse<T>>
}

@Injectable()
export class APIService implements IAPIService{

  private baseURL = 'http://192.168.0.104/';

  constructor() { }

  query<T>(method: APIMethod, payload?: any): Promise<IAPIResponse<T>> {
    const formData  = new FormData();
    if (payload) {
      formData.append('payload', payload);
    }
    return fetch(this.baseURL+method, {
      method: 'POST',
      body: formData,
    })
      .then(res => res.json())
  }

}
