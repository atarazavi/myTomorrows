import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { SnackService } from './snack.service';
import { SharedModule } from '#shared/shared.module';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  imports: [
    CommonModule,
    MatSnackBarModule,
    SharedModule,
    MatButtonModule,
  ],
  providers: [SnackService],
})
export class SnackModule { }
