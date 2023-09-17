import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { TrialsStore } from '../../store/trials.store';
import { Observable, Subject, filter, takeUntil } from 'rxjs';
import { Study } from '../../models/trial.model';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { FlatStudy } from '../../models/flatStudy.model';
import { isNotNull } from '#shared/typescript/nullCheck';
import { StudiesFlattenerService } from '#shared/services/studiesFlattener/studies-flattener.service';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss'],
})
export class FavoritesComponent implements OnInit, OnDestroy {

  favorites$: Observable<Study[] | null>;
  columnsToDisplay: string[];
  dataSource: MatTableDataSource<FlatStudy>;
  expandedElement: Study | null;
  public readonly destroyed$ = new Subject<void>();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<Study>;

  constructor(
    public trialsStore: TrialsStore,
    public studiesFlattenerService: StudiesFlattenerService,
  ) {
    this.favorites$ = this.trialsStore.favorites$;
    this.columnsToDisplay = ['nctId', 'fullName', 'overallStatus', 'action'];
  }

  ngOnInit() {
    this.loadFavoritesData();
  }

  loadFavoritesData() {
    this.favorites$
      .pipe(
        filter(isNotNull),
        takeUntil(this.destroyed$),
      )
      .subscribe(response => {
        const flattenedStudies: FlatStudy[] = this.studiesFlattenerService.flattenStudies(response);
        this.dataSource = new MatTableDataSource(flattenedStudies);
        console.log(this.dataSource);

        setTimeout(() => {
          this.dataSource.sort = this.sort;
        });
      });
  }

  onRemoveFavorite(NctId: string) {
    this.trialsStore.removeFavorite(NctId);
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
