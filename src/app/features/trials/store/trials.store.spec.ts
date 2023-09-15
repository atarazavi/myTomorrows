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
import { DateType, Trials } from '../models/trial.model';

describe('Trials Store API Call', () => {
  let backendService: Spy<TrialsService>;
  let testStore: TrialsStore;
  let snackServiceMock: Spy<SnackService>;
  const mockRouter = createSpyFromClass(Router);
  const sampleTrialsResponse: Trials = {
    studies: [
      {
        protocolSection: {
          identificationModule: {
            nctId: "NCT123456",
            organization: {
              fullName: "ABC Pharmaceuticals"
            },
            briefTitle: "A Study on XYZ Drug",
            officialTitle: "A Phase 3 Randomized Control Study on the Efficacy of XYZ Drug"
          },
          statusModule: {
            overallStatus: "Recruiting",
            startDateStruct: {
              date: new Date('2022-01-01'),
              type: DateType.ACTUAL
            }
          }
        }
      },
      {
        protocolSection: {
          identificationModule: {
            nctId: "NCT789012",
            organization: {
              fullName: "DEF Biotech"
            },
            briefTitle: "A Study on LMN Vaccine",
            officialTitle: "A Phase 2 Clinical Trial on the Safety and Immunogenicity of LMN Vaccine"
          },
          statusModule: {
            overallStatus: "Completed",
            startDateStruct: {
              date: new Date('2020-05-15'),
              type: DateType.ESTIMATED
            }
          }
        }
      }
    ],
    nextPageToken: "somePageToken"
  };
  beforeEach(() => {
    snackServiceMock = createSpyFromClass(SnackService);
    backendService = createSpyFromClass(TrialsService, ['get']);
    TestBed.configureTestingModule({
      imports: [SnackModule, HttpClientTestingModule, UnitTestingModule],
      providers: [
        TrialsStore,
        { provide: TrialsService, useValue: backendService },
        { provide: SnackService, useValue: snackServiceMock },
        { provide: Router, useValue: mockRouter },
      ],
    });
    testStore = TestBed.inject(TrialsStore);
  });

  //  - GET
  it('should update trials$ by backend successful response value when service calling is successful with 200 status', () => {
    backendService.get.and.returnValue(observableOf(sampleTrialsResponse));
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

});
