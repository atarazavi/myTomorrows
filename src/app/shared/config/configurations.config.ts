import { Injectable } from '@angular/core';
import { MatSnackBarConfig } from '@angular/material/snack-bar';
@Injectable({
    providedIn: 'root'
})
export class Configurations {
    public readonly defaultSnackBarPosition: MatSnackBarConfig = {
        horizontalPosition: 'center',
        verticalPosition: 'top',
    };
}