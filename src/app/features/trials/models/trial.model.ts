import { DateType } from "./dateType.model";

export interface Trials {
  studies: Study[],
  nextPageToken: string,
}
export interface Study {
  protocolSection: ProtocolSection;
}

interface ProtocolSection {
  identificationModule: IdentificationModule;
  statusModule: StatusModule;
}

interface IdentificationModule {
  nctId: string;
  organization: Organization;
  briefTitle: string;
  officialTitle: string;
}

interface Organization {
  fullName: string;
}

interface StatusModule {
  overallStatus: string;
  startDateStruct: DateStruct;
}

interface DateStruct {
  date: Date;
  type: DateType;
}
