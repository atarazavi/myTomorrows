import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { UnitTestingModule } from '#shared/test/unit-testing.module';
import { TrialsService } from './trials.service';

describe('TrialsService', () => {
  let service: TrialsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        UnitTestingModule,
      ],
      providers: [
      ],
    });
    service = TestBed.inject(TrialsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
