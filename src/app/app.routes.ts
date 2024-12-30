import { Routes } from '@angular/router';
import { SettingsComponent } from './pages/settings/settings.component';
import { HomeComponent } from './pages/home/home.component';
import { GridComponent } from './pages/grid/grid.component';
import { ModesComponent } from './pages/modes/modes.component';

export enum RouterPath {
  Home = '',
  Grid = 'grid',
  Modes = 'modes',
  Settings = 'settings',
}

export const routes: Routes = [
  { path: RouterPath.Home, component: HomeComponent },
  { path: RouterPath.Grid, component: GridComponent },
  { path: RouterPath.Modes, component: ModesComponent },
  { path: RouterPath.Settings, component: SettingsComponent },
];

