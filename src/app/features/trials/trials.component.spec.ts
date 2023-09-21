import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { subscribeSpyTo } from '@hirez_io/observer-spy';

import { TrialsStore } from './store/trials.store';
import { TrialsModule } from './trials.module';
import { ComponentPage } from '#shared/test/component-page';
import { TrialsComponent } from './trials.component';
import { CreateKeyboardEvent } from '#shared/test/keyboard-event-stub';
import { Trials } from './models/trial.model';
import { UnitTestingModule } from '#shared/test/unit-testing.module';
import { FlatStudy } from './models/flatStudy.model';


class TrialsComponentPage extends ComponentPage<TrialsComponent> {
  FilterInput() {
    return this.querySelector<HTMLElement>('#filterTrialsTableInput');
  }
  FavoritesButton() {
    return this.querySelector<HTMLButtonElement>('.favoriteButton');
  }
}

describe('TrialsComponent', () => {
  let component: TrialsComponent;
  let fixture: ComponentFixture<TrialsComponent>;
  let page: TrialsComponentPage;
  let testStore: TrialsStore;
  const mockKeyboardEvent: KeyboardEvent = CreateKeyboardEvent('NCT123456');
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
  }, {
    nctId: "NCT654321",
    fullName: "Mental Health Organization",
    briefTitle: "Study on Anxiety Disorders",
    officialTitle: "Investigating the Efficacy of Y Therapy for Anxiety Disorders",
    overallStatus: "Completed",
  }];

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        TrialsComponent,
      ],
      providers: [
        TrialsStore,
      ],
      imports: [
        HttpClientTestingModule,
        TrialsModule,
        UnitTestingModule,
        BrowserAnimationsModule
      ]
    });
    testStore = TestBed.inject(TrialsStore);
    fixture = TestBed.createComponent(TrialsComponent);
    page = new TrialsComponentPage(fixture);
    component = fixture.componentInstance;
    component.trials$ = of(sampleTrialsMock.studies);
    fixture.detectChanges();
  });

  it('should create and load data', () => {
    testStore.loadTrials$();
    expect(component).toBeTruthy();
    component.loadData();
    const observerSpyTrials = subscribeSpyTo(component.trials$);
    const observerSpyTrialsResponse = observerSpyTrials.getLastValue();

    if (observerSpyTrialsResponse) {
      expect(component.dataSource.filteredData).toEqual(flattenedTrialsMock);
    }
  });

  it('should filter data when something is written in filter input', () => {
    expect(component.dataSource.filteredData.length).toBe(2);

    component.applyFilter(mockKeyboardEvent);
    fixture.detectChanges();

    expect(component.dataSource.filteredData.length).toBe(1);
  });

  it('should call applyFilter when something is written in filter input', () => {
    spyOn(component, 'applyFilter');
    page.FilterInput().dispatchEvent(new Event('keyup'));
    expect(component.applyFilter).toHaveBeenCalled();
  });

  it('should call onToggleFavorite() when user clicks on a fav button', () => {
    spyOn(component, 'onToggleFavorite');
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      page.FavoritesButton().click();
      expect(component.onToggleFavorite).toHaveBeenCalled();
    })
  });
});
