import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FavoritesComponent } from './favorites.component';
import { SharedModule } from '#shared/shared.module';
import { SkeletonLoaderModule } from '#shared/components/seleton-loader/skeleton-loader.module';
import { SnackModule } from '#shared/components/snack/snack.module';

@NgModule({
  declarations: [
    FavoritesComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    SkeletonLoaderModule,
    SnackModule,
  ],
  providers: [
  ],
  exports: [FavoritesComponent]
})
export class FavoritesModule { }
