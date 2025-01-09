import { ILed } from "./leds";

export enum IPresetStorage {
    LocalStorage,
    HW
}

export interface IPreset {
    id: number;
    name: string;
    createDate: Date;
    modifyDate: Date;
    storage: IPresetStorage;
    leds: ILed[];
}

