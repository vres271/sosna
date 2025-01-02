import { Injectable } from '@angular/core';
import { IGPoint, IGVector, ILed } from '../model/leds';
import { APIMethod, APIService } from './api.service';
import { APIMockService } from '../../mocks/services/apimock.service';
import { IMode } from '../../pages/modes/modes.component';

@Injectable()
export class LedsService {

  constructor(
    private api: APIService
    // private api: APIMockService
  ) { }

  set(leds: ILed[]) {
    const ledsData = this.ledsToString(leds);
    return this.api.query<number[]>(APIMethod.Set, ledsData)
  }

  serialSet(leds: ILed[], onStep: (counter: number) => void) {
    const next = (i: number) => {
      const led = leds[i];
      if (led) {
        this.set([led]).then(res => {
          if (+res?.result === led.ledIndex) {
            onStep(i);
            next(++i);
          }
        })
      }
    }
    next(0);
  }

  clear() {
    return this.api.query<'ok'>(APIMethod.Clear);
  }

  setMode(modeId: number) {
    return this.api.query<number>(APIMethod.SetMode, String(modeId));
  }

  getModes() {
    return this.api.query<{modes: IMode[], mode: number}>(APIMethod.GetModes);
  }

  testAddr(address: string) {
    this.api.setBaseUrl(address);
    return  this.api.query(APIMethod.DeviceInfo);
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

  public get isPending() {
    return this.api.isPending;
  }



}
