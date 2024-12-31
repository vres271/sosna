import { Injectable } from '@angular/core';
import { APIMethod, IAPIResponse, IAPIService } from '../../shared/services/api.service';
import { IMode } from '../../pages/modes/modes.component';

const modes: IMode[] = [
  {id: 1, name: 'Sinus Warm'},
  {id: 2, name: 'Sinus Cold'},
  {id: 3, name: 'Sinus RGB'},
]

@Injectable()
export class APIMockService implements IAPIService {

  private loging = true;
  private shortLogMode = false;
  private responseDelay = 310;

  public isPending = false;

  private selectedModeId = 0;

  constructor() {}

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
        this.selectedModeId = payload ? parseInt(payload, 10) : 0;
        result = this.selectedModeId;
        return {result};
      case APIMethod.GetModes:
        return {result: {modes, mode: this.selectedModeId}};
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
