import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { HttpErrorResponse } from '@angular/common/http';

import { GenericBackendService } from './generic-backend.service';

interface TestItemType {
  id: number
}

describe('GenericBackendService', () => {
  let genericService: GenericBackendService<TestItemType, TestItemType['id']>;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],
      providers: [
        GenericBackendService,
        { provide: String, useValue: "url" },
      ]
    });
    genericService = TestBed.inject(GenericBackendService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(genericService).toBeTruthy();
  });

  it('should call API using GET method using the provided URL to GET all related data', fakeAsync((done: DoneFn) => {
    genericService.get().subscribe(response => {
      tick();
      expect(response).toBeTruthy();
      done();
    });

    const request = httpTestingController.expectOne(genericService.url);
    expect(request.request.method).toEqual('GET');
  }));

  it('should throw an ERROR if GET fails', (done: DoneFn) => {

    const emsg = 'deliberate 404 error';
    spyOn(genericService, 'handleError').and.callThrough();

    genericService.get(0).subscribe({
      next: () => fail("the get API should fail"),
      error: (error: HttpErrorResponse) => {
        expect(genericService.handleError).toHaveBeenCalled(); // check if executed
        expect(error.status).withContext('status');
        expect(error.error).withContext('message');
        done();
      }
    });

    const request = httpTestingController.expectOne(genericService.url);
    expect(request.request.method).toEqual('GET');

    // Respond with mock error
    request.flush(emsg, { status: 404, statusText: 'Not Found' });
  });

  it('should call API using GET method using the provided URL to GET specific data according to the ID', fakeAsync((done: DoneFn) => {
    genericService.getByID(1).subscribe(response => {
      tick();
      expect(response).toBeTruthy();
      done();
    });

    const request = httpTestingController.expectOne(`${genericService.url}/1`);
    expect(request.request.method).toEqual('GET');
  }));

  it('should call API using POST method using the provided URL to ADD provided data', fakeAsync((done: DoneFn) => {
    genericService.postWithoutId({ id: 1 }).subscribe(response => {
      tick();
      expect(response).toBeTruthy();
      done();
    });

    const request = httpTestingController.expectOne(genericService.url);
    expect(request.request.method).toEqual('POST');

    expect(request.request.body.id).toEqual(1);
  }));

  it('should call API using PUT method using the provided URL to UPDATE provided data', fakeAsync((done: DoneFn) => {
    genericService.put(1, { id: 1 }).subscribe(response => {
      tick();
      expect(response).toBeTruthy();
      done();
    });

    const request = httpTestingController.expectOne(`${genericService.url}/1`);
    expect(request.request.method).toEqual('PUT');
    expect(request.request.body.id).toEqual(1);
  }));

  it('should call API using PATCH method using the provided URL to UPDATE provided data', fakeAsync((done: DoneFn) => {
    genericService.update(1, { id: 1 }).subscribe(response => {
      tick();
      expect(response).toBeTruthy();
      done();
    });

    const request = httpTestingController.expectOne(`${genericService.url}/1`);
    expect(request.request.method).toEqual('PATCH');
    expect(request.request.body.id).toEqual(1);
  }));

  it('should call API using DELETE method using the provided URL', fakeAsync((done: DoneFn) => {
    genericService.delete(1).subscribe(response => {
      tick();
      expect(response).toBeTruthy();
      done();
    });

    const request = httpTestingController.expectOne(`${genericService.url}/1`);
    expect(request.request.method).toEqual('DELETE');
  }));
});