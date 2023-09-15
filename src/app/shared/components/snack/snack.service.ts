import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

import { Configurations } from '#shared/config/configurations.config';

@Injectable()
export class SnackService {

  config: MatSnackBarConfig = {
    ...this.configs.defaultSnackBarPosition,
  };

  constructor(
    private readonly _snackBar: MatSnackBar,
    private configs: Configurations,
  ) { }

  showConfirmSnackBar(message: string, confirmButtonText = 'OK', position = this.config) {
    this._snackBar.open(message, confirmButtonText, position);
  }

  showSnackBar(message: string, duration = 3000, position = this.config) {
    this._snackBar.open(message, undefined, { ...position, duration: duration });
  }

  showErrorSnackBar(message: string, duration = 6000, position = this.config) {
    this.showSnackBar(message, duration, position);
  }
} 
