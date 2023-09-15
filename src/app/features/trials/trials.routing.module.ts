import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TrialsComponent } from './trials.component';
import { FavoritesComponent } from './components/favorites/favorites.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full',
  },
  {
    path: 'list',
    component: TrialsComponent,
  },
  {
    path: 'favorites',
    component: FavoritesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrialsRoutingModule { }
