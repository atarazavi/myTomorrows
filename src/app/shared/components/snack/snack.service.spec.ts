import { TestBed } from '@angular/core/testing';
import { MatSnackBarModule, MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { createSpyFromClass, Spy } from 'jasmine-auto-spies';

import { Configurations } from '#shared/config/configurations.config';
import { SnackService } from './snack.service';

describe('SnackService', () => {
  let fakeMatSnack: Spy<MatSnackBar>;
  let configMatsnack: MatSnackBarConfig;
  let service: SnackService;
  let appConfigs: Configurations;
  beforeEach(() => {
    fakeMatSnack = createSpyFromClass(MatSnackBar);
    TestBed.configureTestingModule({
      imports: [MatSnackBarModule],
      providers: [
        SnackService,
        { provide: MatSnackBar, useValue: fakeMatSnack }
      ]
    });
    service = TestBed.inject(SnackService);
    appConfigs = TestBed.inject(Configurations);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should open a snackbar with the given message', () => {
    const message = 'my message';
    configMatsnack = { ...appConfigs.defaultSnackBarPosition, duration: 3000 };
    service.showSnackBar(message, 3000);

    expect(fakeMatSnack.open).toHaveBeenCalledWith(message, undefined, configMatsnack);
  });

  it('should use a default duration of 3000ms if none is provided', () => {
    service.showSnackBar(undefined as unknown as string);

    const configMatsnack = { ...appConfigs.defaultSnackBarPosition, duration: 3000 };
    expect(fakeMatSnack.open).toHaveBeenCalledWith(undefined as unknown as string, undefined, configMatsnack);
  });

  it('should use the given duration if one is provided', () => {
    const message = 'my message';
    service.showSnackBar(message, 1000);

    const configMatsnack = { ...appConfigs.defaultSnackBarPosition, duration: 1000 };
    expect(fakeMatSnack.open).toHaveBeenCalledWith(message, undefined, configMatsnack);
  });

  it('should open a snackbar with confirm button text OK and given message', () => {
    const message = 'my message';
    service.showConfirmSnackBar(message, 'OK');
    const configMatsnack = { ...appConfigs.defaultSnackBarPosition };
    expect(fakeMatSnack.open).toHaveBeenCalledWith(message, 'OK', configMatsnack);
  });

  it('should open a snackbar with the given confirm button text OK if one is provided', () => {
    const message = 'my message';
    const myButtonText = 'Greit';
    const configMatsnack = { ...appConfigs.defaultSnackBarPosition };
    service.showConfirmSnackBar(message, myButtonText);

    expect(fakeMatSnack.open).toHaveBeenCalledWith(message, myButtonText, configMatsnack);
  });

});
