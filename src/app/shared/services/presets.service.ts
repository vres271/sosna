import { Injectable } from '@angular/core';
import { LocalStorageService } from './local-storage.service';
import { IPreset, IPresetStorage } from '../model/presets';
import { ILed } from '../model/leds';

@Injectable()
export class PresetsService {

  private storageKey = 'presets';

  constructor(
    private storage: LocalStorageService
  ) { }

  get(): IPreset[] {
    const presets = this.storage.get(this.storageKey)?.map((storageItem: string) => this.storageItemToPreset(storageItem));
    return presets?.length ? presets : [];
  }

  set(preset: IPreset): void {
    preset.modifyDate = new Date();
    const presets = this.get().map(p => p.id === preset.id ? preset : p);
    this.storage.set(this.storageKey, presets.map(p => this.presetToStorageItem(p)));
  }

  add(preset: IPreset): void {
    const presets = this.get();
    preset.id = this.generateId();
    preset.createDate = new Date();
    presets.push(preset);
    this.storage.set(this.storageKey, presets.map(p => this.presetToStorageItem(p)));
  }

  delete(presetId: number): void {
    const presets = this.get().filter(p => +p.id !== +presetId);
    this.storage.set(this.storageKey, presets.map(p => this.presetToStorageItem(p)));
  }

  createPreset(name: string, leds: ILed[] = []): IPreset {
    return {
      id: 0,
      name,
      createDate: new Date(),
      modifyDate: new Date(),
      storage: IPresetStorage.LocalStorage,
      leds
    }
  }

  generateId(): number {
    return Date.now() + Math.round(100000*Math.random());
  }

  storageItemToPreset(storageItem: string): IPreset {
    const preset = JSON.parse(storageItem);
    return {
      ...preset,
      createDate: new Date(preset.createDate),
      modifyDate: new Date(preset.modifyDate)
    }
  }

  presetToStorageItem(preset: IPreset): string {
    return JSON.stringify({
      ...preset,
      createDate: preset.createDate.toISOString(),
      modifyDate: preset.modifyDate.toISOString()
    });
  }

}
