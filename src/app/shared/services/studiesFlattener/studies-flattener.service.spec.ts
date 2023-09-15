import { TestBed } from '@angular/core/testing';

import { StudiesFlattenerService } from './studies-flattener.service';

describe('StudiesFlattenerService', () => {
  let service: StudiesFlattenerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StudiesFlattenerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
