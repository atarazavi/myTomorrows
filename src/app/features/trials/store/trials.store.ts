import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { EMPTY, pipe } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { HttpErrorResponse, HttpParams } from '@angular/common/http';

import { Study } from '../models/trial.model';
import { TrialsService } from '../services/trials.service';
import { SnackService } from '#shared/components/snack/snack.service';

interface TrialsStoreInterface {
  trials: Study[] | null;
  nextPageToken: string | null;
  trialsError: HttpErrorResponse | null;
}

@Injectable()
export class TrialsStore extends ComponentStore<TrialsStoreInterface> {
  public studiesList: Study[] = [];
  readonly trials$ = this.select((state) => state.trials);
  readonly trialsError$ = this.select((state) => state.trialsError);
  public buffer: Study[] = [];

  constructor(
    private trialsService: TrialsService,
    private readonly snackService: SnackService,
  ) {
    super({
      trials: null,
      trialsError: null,
      nextPageToken: null,
    });
  }

  loadTrials$ = this.effect<void>(
    pipe(
      switchMap(() => {
        const nextPageToken = this.get().nextPageToken; // Get nextPageToken from current state
        let params = new HttpParams();
        if (nextPageToken !== null) {
          params = params.set('pageToken', nextPageToken);
        }
        return this.trialsService.get(0, params).pipe(
          tap({
            next: (trials) => {
              this.studiesList = trials.studies;
              this.patchState({
                trials: trials.studies,
                nextPageToken: trials.nextPageToken,
              });
              this.resetErrors();
            },
            error: (trialsError) => this.patchState({ trialsError: trialsError }),
          }),
          catchError(() => EMPTY)
        );
      })
    )
  );

  resetErrors() {
    this.patchState({ trialsError: null })
  }
}
