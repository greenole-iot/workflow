import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Schedule } from './model/schedule';
import * as i0 from "@angular/core";
export declare class ScheduleService {
    private http;
    constructor(http: HttpClient);
    getProcessSchedules(domainId: string, processId: string): Observable<Array<Schedule>>;
    createOrUpdateSchedule(domainId: string, processId: string, schedule: Schedule): Observable<string>;
    deleteSchedule(domainId: string, scheduleId: string): Observable<any>;
    static ɵfac: i0.ɵɵFactoryDef<ScheduleService, never>;
    static ɵprov: i0.ɵɵInjectableDef<ScheduleService>;
}
