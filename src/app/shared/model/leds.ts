export enum TimeFn {
  Empty,
  Step,
  Gradient
}

export enum OrderFn {
  Empty,
  Linear,
  Random
}

export interface IGPoint {
  r: number;
  g: number;
  b: number;
  t: number;
  timeFn: TimeFn;
  orderFn: OrderFn;
}

export interface IGVector {
  points: IGPoint[];
  t: number;
}

export interface ILed {
  ledIndex: number;
  vector: IGVector;
}
