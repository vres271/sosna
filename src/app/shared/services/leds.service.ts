import { Injectable } from '@angular/core';
import { IGPoint, IGVector, ILed } from '../model/leds';
import { APIMethod, APIService } from './api.service';
import { APIMockService } from '../../mocks/services/apimock.service';

@Injectable()
export class LedsService {

  constructor(
    // private api: APIService
    private api: APIMockService
  ) { }

  set(leds: ILed[]) {
    const ledsData = this.ledsToString(leds);
    return this.api.query<number[]>(APIMethod.Set, ledsData)
  }

  clear() {
    return this.api.query<'ok'>(APIMethod.Clear);
  }

  private ledsToString(leds: ILed[]) {
    return leds
      .map(led => led.ledIndex + ':' + this.vectorToString(led.vector))
      .join(';')
  }

  private vectorToString(vector: IGVector) {
    return vector.points
      .map(this.pointToString)
      .join('|');
  }

  private pointToString(p: IGPoint) {
    return `${p.r},${p.g},${p.b},${p.t},${p.timeFn},${p.orderFn}`;
  }


}
