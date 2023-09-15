import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SkeletonLoaderComponent } from './skeleton-loader.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    SkeletonLoaderComponent,
  ],
  exports: [
    SkeletonLoaderComponent,
  ],
})
export class SkeletonLoaderModule { }
