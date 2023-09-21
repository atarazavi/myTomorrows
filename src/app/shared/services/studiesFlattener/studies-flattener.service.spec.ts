import { TestBed } from '@angular/core/testing';

import { StudiesFlattenerService } from './studies-flattener.service';
import { Study } from 'src/app/features/trials/models/trial.model';
import { FlatStudy } from 'src/app/features/trials/models/flatStudy.model';

describe('StudiesFlattenerService', () => {
  let service: StudiesFlattenerService;

  const sampleStudiesMock: Study[] = [{
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
  ];
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
    TestBed.configureTestingModule({});
    service = TestBed.inject(StudiesFlattenerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should flatten trial object', () => {
    const returnedArray = service.flattenStudies(sampleStudiesMock);
    expect(returnedArray).toEqual(flattenedTrialsMock);
  });
});
