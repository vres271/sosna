import { Injectable } from '@angular/core';
import { APIMethod, IAPIResponse, IAPIService } from '../../shared/services/api.service';

@Injectable()
export class APIMockService implements IAPIService {

  private loging = true;
  private shortLogMode = false;
  private responseDelay = 300;

  public isPending = false;

  constructor() { }

  query<T>(method: APIMethod, payload?: string): Promise<IAPIResponse<T>> {
    this.isPending = true;
    return new Promise<IAPIResponse<any>>(resolve => {
      setTimeout(() => {
        const response = this.handle(method, payload);
        if (this.loging) {
          this.log('APIMockService', method, payload, response);
        }
        resolve(response);
        this.isPending = false;
      }, this.responseDelay)
    })
  }

  handle(method: APIMethod, payload?: string ) {
    let result;
    switch (method) {
      case APIMethod.Set:
        result = payload?.split(';').map(l => +l?.split(':')?.[0]);
        return {result};
      case APIMethod.Clear:
        return {result: 'ok'};
      case APIMethod.SetMode:
        result = payload ? parseInt(payload, 10) : null;
        return {result};
      default:
        return {result: 'Unknown method'};
    }
  }

  log(label: string, method: APIMethod, payload?: string, response?: IAPIResponse<any>) {
    if (this.shortLogMode) {
      console.log(payload, response?.result);
    } else {
      console.log(label, {method, payload, response});
    }
  }

}
