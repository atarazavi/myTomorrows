import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'trials',
    pathMatch: 'full',
  },
  {
    path: 'trials',
    loadChildren: () => import('./features/trials/trials.module').then(m => m.TrialsModule),
  },];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
