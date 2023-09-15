import { DateType } from "./dateType.model";

export interface FlatStudy {
    nctId: string;
    fullName: string;
    briefTitle: string;
    officialTitle: string;
    overallStatus: string;
    startDate: Date;
    dateType: DateType;
}