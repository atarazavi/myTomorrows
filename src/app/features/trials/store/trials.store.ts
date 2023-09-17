import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { EMPTY, interval, pipe } from 'rxjs';
import { catchError, switchMap, take, tap } from 'rxjs/operators';
import { HttpErrorResponse, HttpParams } from '@angular/common/http';

import { Study } from '../models/trial.model';
import { TrialsService } from '../services/trials.service';
import { SnackService } from '#shared/components/snack/snack.service';

interface TrialsStoreInterface {
  trials: Study[] | null;
  nextPageToken: string | null;
  trialsError: HttpErrorResponse | null;
  favorites: Study[];
}

@Injectable()
export class TrialsStore extends ComponentStore<TrialsStoreInterface> {
  public studiesList: Study[] = [];
  readonly trials$ = this.select((state) => state.trials);
  readonly trialsError$ = this.select((state) => state.trialsError);
  readonly favorites$ = this.select((state) => state.favorites);
  private trialsBuffer: Study[] = [];

  constructor(
    private trialsService: TrialsService,
    private readonly snackService: SnackService,
  ) {
    super({
      trials: null,
      trialsError: null,
      nextPageToken: null,
      favorites: [],
    });
    // Initialize the timer and data flow
    this.initTimer();
  }
  private initTimer() {
    // Start a timer that ticks every 5000ms (5s)
    interval(5000).subscribe(() => {
      this.updateTrialsList();
    });
  }

  private updateTrialsList() {
    // If buffer is empty, fetch new trials
    if (this.trialsBuffer.length === 0) {
      this.fetchTrials(this.get().nextPageToken).pipe(take(1)).subscribe();
      return;
    }

    // Get the next trial from the buffer
    const nextTrial = this.trialsBuffer.shift();

    // Get the current list of trials
    const currentTrials = [...(this.get().trials ?? [])];

    // Add the next trial to the list
    if (nextTrial) {
      currentTrials.push(nextTrial);
    }

    // If the list exceeds 10, remove the oldest (first) item
    if (currentTrials.length > 10) {
      currentTrials.shift();
    }

    // Update the state
    this.patchState({ trials: currentTrials });
  }

  private fetchTrials(nextPageToken: string | null) {
    return this.trialsService.get(0, this.createQueryParams(nextPageToken)).pipe(
      tap({
        next: (trials) => {
          // Update buffer with new trials
          this.trialsBuffer = trials.studies;
          this.patchState({
            nextPageToken: trials.nextPageToken,
          });
          this.resetErrors();
        },
        error: (trialsError) => this.patchState({ trialsError: trialsError }),
      }),
      catchError(() => EMPTY)
    );
  }

  private createQueryParams(nextPageToken: string | null): HttpParams {
    let params = new HttpParams();
    if (nextPageToken) {
      params = params.set('pageToken', nextPageToken);
    }
    return params;
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
  addFavorite(NctId: string) {
    const currentFavorites = this.get().favorites;

    if (currentFavorites.length >= 10) {
      // Handle maximum favorites reached
      this.snackService.showErrorSnackBar('Maximum number of favorites reached');
      return;
    }

    // Look for the trial in the trialsBuffer
    let toBeAddedTrial = this.trialsBuffer.find(each => each.protocolSection.identificationModule.nctId === NctId);

    // If not found in the buffer, look for it in the current list of trials
    if (!toBeAddedTrial) {
      const currentTrials = this.get().trials;
      if (currentTrials) {
        toBeAddedTrial = currentTrials.find(each => each.protocolSection.identificationModule.nctId === NctId);
      }
    }

    if (toBeAddedTrial) {
      const updatedFavorites = [...currentFavorites, toBeAddedTrial];
      this.patchState({ favorites: updatedFavorites });
    }
  }

  removeFavorite(toBeRemovedNctId: string) {
    const currentFavorites = this.get().favorites;
    const updatedFavorites = currentFavorites.filter(t => t.protocolSection.identificationModule.nctId !== toBeRemovedNctId);
    this.patchState({ favorites: updatedFavorites });
  }

  resetErrors() {
    this.patchState({ trialsError: null })
  }
}
