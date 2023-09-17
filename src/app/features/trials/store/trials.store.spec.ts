import { TestBed } from '@angular/core/testing';
import { createSpyFromClass, Spy } from 'jasmine-auto-spies';
import { of as observableOf } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { subscribeSpyTo } from '@hirez_io/observer-spy';

import { SnackModule } from '#shared/components/snack/snack.module';
import { UnitTestingModule } from '#shared/test/unit-testing.module';
import { SnackService } from '#shared/components/snack/snack.service';
import { TrialsService } from '../services/trials.service';
import { TrialsStore } from './trials.store';
import { Trials } from '../models/trial.model';
import { DateType } from '../models/dateType.model';
import { FlatStudy } from '../models/flatStudy.model';
import { HttpErrorResponse } from '@angular/common/http';

describe('Trials Store API Call', () => {
  let backendService: Spy<TrialsService>;
  let testStore: TrialsStore;
  let snackServiceMock: Spy<SnackService>;
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
  beforeEach(() => {
    snackServiceMock = createSpyFromClass(SnackService);
    backendService = createSpyFromClass(TrialsService, ['get']);
    TestBed.configureTestingModule({
      imports: [SnackModule, HttpClientTestingModule, UnitTestingModule],
      providers: [
        TrialsStore,
        { provide: TrialsService, useValue: backendService },
        { provide: SnackService, useValue: snackServiceMock },
      ],
    });
    testStore = TestBed.inject(TrialsStore);
  });

  //  - GET
  it('should update trials$ by backend successful response value when service calling is successful with 200 status', () => {
    backendService.get.and.returnValue(observableOf(sampleTrialsMock));
    testStore.loadTrials$();

    const observerSpyTrials = subscribeSpyTo(testStore.trials$);
    const observerSpyTrialsError = subscribeSpyTo(testStore.trialsError$);

    expect(observerSpyTrials.getLastValue()?.length).toBe(2);
    expect(observerSpyTrialsError.getLastValue()).toBeNull();
  });

  it('should update the trialsError$ with HttpError', () => {
    backendService.get.and.throwWith(observableOf(ErrorEvent));
    testStore.loadTrials$();

    const observerSpyUsersError = subscribeSpyTo(testStore.trialsError$);

    expect(observerSpyUsersError.getLastValue()).not.toBeNull();
  });

  it('should correctly add a favorite trial when addFavorite is called', () => {
    testStore.patchState({
      favorites: [],
      trials: sampleTrialsMock.studies
    });
    testStore.addFavorite('NCT123456');

    const observerSpyFavorites = subscribeSpyTo(testStore.favorites$);
    const lastValue = observerSpyFavorites.getLastValue() || [];

    expect(lastValue[0]?.protocolSection?.identificationModule?.nctId).toEqual('NCT123456');
  });

  it('should correctly remove a favorite trial when removeFavorite is called', () => {
    testStore.patchState({
      favorites: sampleTrialsMock.studies
    });
    testStore.removeFavorite('NCT123456');

    const observerSpyFavorites = subscribeSpyTo(testStore.favorites$);
    const lastValue = observerSpyFavorites.getLastValue() || [];

    expect(lastValue.length).toBe(1);
    expect(lastValue[0]?.protocolSection.identificationModule.nctId).toEqual('NCT654321');
  });

  it('should reset trialsError when resetErrors is called', () => {
    testStore.patchState({
      trialsError: { message: 'Some error occurred' } as HttpErrorResponse
    });
    testStore.resetErrors();

    const observerSpyTrialsError = subscribeSpyTo(testStore.trialsError$);
    expect(observerSpyTrialsError.getLastValue()).toBeNull();
  });

  it('should correctly update trials list from trialsBuffer when updateTrialsList is called', () => {
    // Populate the trialsBuffer with mock data
    testStore.trialsBuffer = sampleTrialsMock.studies;

    // Mock the initial state with an empty trials array
    testStore.patchState({ trials: [] });

    // Call the method to update the trials list
    (testStore as any).updateTrialsList(); // Casting to 'any' if method is private

    // Spy on the trials$ observable to check if it got updated correctly
    const observerSpyTrials = subscribeSpyTo(testStore.trials$);
    const lastValue = observerSpyTrials.getLastValue() || [];

    // Validate that the trials list got updated
    expect(lastValue.length).toBe(1);
    expect(lastValue[0]?.protocolSection?.identificationModule?.nctId).toEqual('NCT123456');
  });
});
