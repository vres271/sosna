import { Injectable } from '@angular/core';
import { APIMethod, IAPIResponse, IAPIService } from '../../shared/services/api.service';

@Injectable()
export class APIMockService implements IAPIService {

  private loging = true;
  private responseDelay = 300;

  constructor() { }

  query<T>(method: APIMethod, payload?: string): Promise<IAPIResponse<T>> {
    return new Promise<IAPIResponse<any>>(resolve => {
      setTimeout(() => {
        const response = this.handle(method, payload);
        if (this.loging) {
          console.log('APIMockService', {method, payload, response});
        }
        resolve(response);
      }, this.responseDelay)
    })
  }

  handle(method: APIMethod, payload?: string ) {
    switch (method) {
      case APIMethod.Set:
        const result = payload?.split(';').map(l => +l?.split(':')?.[0]);
        return {result};
      case APIMethod.Clear:
        return {result: 'ok'};
      default:
        return {result: 'Unknown method'};
    }
  }

}
