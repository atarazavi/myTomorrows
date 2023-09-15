import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { GenericBackendService } from '#shared/services/backend/generic-backend.service';
import { Trials } from '../models/trial.model';
import { ApiEndpoints } from '#shared/config/api-endpoints';
import { appConfigurations } from '#shared/config/app-config';

@Injectable({
  providedIn: 'root'
})
export class TrialsService extends GenericBackendService<Trials, void> {
  constructor(
    httpClient: HttpClient,
  ) {
    super(appConfigurations.baseUrl + ApiEndpoints.studies, httpClient);
  }
}
