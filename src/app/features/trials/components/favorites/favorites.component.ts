import { Component } from '@angular/core';
import { TrialsStore } from '../../store/trials.store';
import { Observable } from 'rxjs';
import { Study } from '../../models/trial.model';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss'],
})
export class FavoritesComponent {

  favorites$: Observable<Study[] | null>;

  constructor(
    public trialsStore: TrialsStore,
  ) {

    this.favorites$ = this.trialsStore.favorites$;
  }
}