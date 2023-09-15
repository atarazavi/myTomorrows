import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialDesignModule } from './materialdesign/materialdesign.module';

@NgModule({
  imports: [
    CommonModule,
    MaterialDesignModule,
  ],
  exports: [
    MaterialDesignModule,
  ]
})
export class SharedModule { }
