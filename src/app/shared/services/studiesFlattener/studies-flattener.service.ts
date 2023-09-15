import { Injectable } from '@angular/core';
import { FlatStudy } from 'src/app/features/trials/models/flatStudy.model';
import { Study } from 'src/app/features/trials/models/trial.model';

@Injectable({
  providedIn: 'root'
})
export class StudiesFlattenerService {
  public flattenStudies = (studies: Study[]): FlatStudy[] => {
    return studies.map(study => {
      return {
        nctId: study.protocolSection.identificationModule.nctId,
        fullName: study.protocolSection.identificationModule.organization.fullName,
        briefTitle: study.protocolSection.identificationModule.briefTitle,
        officialTitle: study.protocolSection.identificationModule.officialTitle,
        overallStatus: study.protocolSection.statusModule.overallStatus,
        startDate: study.protocolSection.statusModule.startDateStruct.date,
        dateType: study.protocolSection.statusModule.startDateStruct.type,
      };
    });
  };
}
