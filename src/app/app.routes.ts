import { Routes } from '@angular/router';
import { SettingsComponent } from './pages/settings/settings.component';
import { HomeComponent } from './pages/home/home.component';

export enum RouterPath {
  Home = '',
  Settings = 'settings',
}

export const routes: Routes = [
  { path: RouterPath.Home, component: HomeComponent },
  { path: RouterPath.Settings, component: SettingsComponent },
];

