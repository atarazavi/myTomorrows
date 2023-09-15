import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { SkeletonLoaderModule } from '#shared/components/seleton-loader/skeleton-loader.module';
import { TrialsComponent } from './trials.component';
import { SnackModule } from '#shared/components/snack/snack.module';
import { TrialsRoutingModule } from './trials.routing.module';
import { SharedModule } from '#shared/shared.module';
import { FavoritesModule } from './components/favorites/favorites.module';
import { TrialsStore } from './store/trials.store';

@NgModule({
  declarations: [TrialsComponent],
  imports: [
    CommonModule,
    SharedModule,
    HttpClientModule,
    SkeletonLoaderModule,
    SnackModule,
    TrialsRoutingModule,
    FavoritesModule,
  ],
  exports: [TrialsComponent],
  providers: [
    TrialsStore,
  ]
})
export class TrialsModule { }
