import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { SnackModule } from '#shared/components/snack/snack.module';
import { UnitTestingModule } from '#shared/test/unit-testing.module';
import { FavoritesComponent } from './favorites.component';
import { TrialsStore } from '../../store/trials.store';
import { ComponentPage } from '#shared/test/component-page';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { DateType } from '../../models/dateType.model';
import { FlatStudy } from '../../models/flatStudy.model';
import { Trials } from '../../models/trial.model';

class FavoriteComponentPage extends ComponentPage<FavoritesComponent> {
  FavoritesRemoveButton() {
    return this.querySelector<HTMLButtonElement>('.remove_favorite-button');
  }
}

describe('FavoriteComponent : AddMode', () => {
  let component: FavoritesComponent;
  let fixture: ComponentFixture<FavoritesComponent>;
  let page: FavoriteComponentPage;
  const sampleTrialsMock: Trials = {
    studies: [
      {
        protocolSection: {
          identificationModule: {
            nctId: "NCT123456",
            organization: {
              fullName: "Health Research Institute",
            },
            briefTitle: "Study on Cardiovascular Diseases",
            officialTitle: "A Comprehensive Study on the Effects of X Drug on Cardiovascular Diseases",
          },
          statusModule: {
            overallStatus: "Recruiting",
            startDateStruct: {
              date: new Date('2023-01-01T00:00:00'),
              type: DateType.ACTUAL,
            },
          },
        },
      },
      {
        protocolSection: {
          identificationModule: {
            nctId: "NCT654321",
            organization: {
              fullName: "Mental Health Organization",
            },
            briefTitle: "Study on Anxiety Disorders",
            officialTitle: "Investigating the Efficacy of Y Therapy for Anxiety Disorders",
          },
          statusModule: {
            overallStatus: "Completed",
            startDateStruct: {
              date: new Date('2021-06-15T00:00:00'),
              type: DateType.ESTIMATED,
            },
          },
        },
      },
    ],
    nextPageToken: "ABC123XYZ",
  };
  const flattenedTrialsMock: FlatStudy[] = [{
    nctId: "NCT123456",
    fullName: "Health Research Institute",
    briefTitle: "Study on Cardiovascular Diseases",
    officialTitle: "A Comprehensive Study on the Effects of X Drug on Cardiovascular Diseases",
    overallStatus: "Recruiting",
    startDate: new Date('2023-01-01T00:00:00'),
    dateType: DateType.ACTUAL,
  }, {
    nctId: "NCT654321",
    fullName: "Mental Health Organization",
    briefTitle: "Study on Anxiety Disorders",
    officialTitle: "Investigating the Efficacy of Y Therapy for Anxiety Disorders",
    overallStatus: "Completed",
    startDate: new Date('2021-06-15T00:00:00'),
    dateType: DateType.ESTIMATED,
  }];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        FavoritesComponent,
      ],
      providers: [
        TrialsStore,
      ],
      imports: [
        SnackModule,
        RouterTestingModule,
        HttpClientTestingModule,
        UnitTestingModule,
      ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(FavoritesComponent);
    page = new FavoriteComponentPage(fixture);
    component = fixture.componentInstance;
    component.favorites$ = of(sampleTrialsMock.studies);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });



  it('should populate dataSource after loadFavoritesData() is called', () => {

    expect(component.dataSource.data).toEqual(flattenedTrialsMock);
  });

  it('should call onRemoveFavorite() when user clicks on a fav remove button', () => {
    spyOn(component, 'onRemoveFavorite');
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      page.FavoritesRemoveButton().click();
      expect(component.onRemoveFavorite).toHaveBeenCalled();
    })
  });

  it('should call loadFavoritesData() during ngOnInit', () => {
    spyOn(component, 'loadFavoritesData');
    component.ngOnInit();
    expect(component.loadFavoritesData).toHaveBeenCalled();
  });

  it('should call next() and complete() on destroyed$ during ngOnDestroy', () => {
    spyOn(component.destroyed$, 'next');
    spyOn(component.destroyed$, 'complete');
    component.ngOnDestroy();
    expect(component.destroyed$.next).toHaveBeenCalled();
    expect(component.destroyed$.complete).toHaveBeenCalled();
  });

});