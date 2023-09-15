import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { EMPTY, pipe } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { Study } from '../models/trial.model';
import { TrialsService } from '../services/trials.service';
import { SnackService } from '#shared/components/snack/snack.service';

interface TrialsStoreInterface {
  trials: Study[] | null;
  trialsError: HttpErrorResponse | null;
}

@Injectable()
export class TrialsStore extends ComponentStore<TrialsStoreInterface> {
  public studiesList: Study[] = [];
  readonly trials$ = this.select((state) => state.trials);
  readonly trialsError$ = this.select((state) => state.trialsError);

  constructor(
    private trialsService: TrialsService,
    private readonly snackService: SnackService,
    private readonly router: Router,
  ) {
    super({
      trials: null,
      trialsError: null,
    });
  }

  loadTrials$ = this.effect<void>(
    pipe(
      switchMap(() =>
        this.trialsService.get(0).pipe(
          tap({
            next: (trials) => {
              this.studiesList = trials.studies;
              this.patchState({ trials: trials.studies });
              this.resetErrors();
            },
            error: (trialsError) => this.patchState({ trialsError: trialsError }),
          }),
          catchError(() => EMPTY)
        )
      )
    )
  );

  resetErrors() {
    this.patchState({ trialsError: null })
  }
}
