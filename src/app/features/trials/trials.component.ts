import { StudiesFlattenerService } from './../../shared/services/studiesFlattener/studies-flattener.service';
import { Router } from '@angular/router';
import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { filter, Observable, Subject, takeUntil } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { trigger, state, style, transition, animate } from '@angular/animations';

import { isNotNull } from '#shared/typescript/nullCheck';
import { Study } from './models/trial.model';
import { TrialsStore } from './store/trials.store';
import { FlatStudy } from './models/flatStudy.model';

@Component({
  selector: 'app-trials',
  templateUrl: './trials.component.html',
  styleUrls: ['./trials.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed, void', style({ height: '0px' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
      transition('expanded <=> void',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class TrialsComponent implements OnInit, OnDestroy {
  trials$: Observable<Study[] | null>;
  trialsError$: Observable<HttpErrorResponse | null>;
  columnsToDisplay: string[];
  columnsToDisplayWithExpand: string[];
  dataSource: MatTableDataSource<FlatStudy>;
  expandedElement: Study | null;
  private readonly destroyed$ = new Subject<void>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<Study>;

  constructor(
    public trialsStore: TrialsStore,
    private readonly router: Router,
    private studiesFlattenerService: StudiesFlattenerService,
  ) {
    this.trials$ = this.trialsStore.trials$;
    this.trialsError$ = this.trialsStore.trialsError$;
    this.columnsToDisplay = ['nctId', 'fullName', 'overallStatus'];
    this.columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];
  }

  ngOnInit() {
    this.loadData();
  }

  public loadData() {
    this.trialsStore.loadTrials$();
    this.trials$
      .pipe(
        filter(isNotNull),
        takeUntil(this.destroyed$),
      )
      .subscribe(response => {
        const flattenedStudies: FlatStudy[] = this.studiesFlattenerService.flattenStudies(response);
        this.dataSource = new MatTableDataSource(flattenedStudies);
        setTimeout(() => {
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        });
      });
  }
  applyFilter(event: KeyboardEvent) {
    if (!(event.target instanceof HTMLInputElement)) {
      return;
    }
    this.dataSource.filter = event.target.value.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onAddFavorite(NctId: string) {
    console.log(NctId);

    this.trialsStore.addFavorite(NctId);
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

}