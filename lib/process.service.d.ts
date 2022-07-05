import { TrackingService } from '@alis/ng-base';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Process } from './model/process';
import * as i0 from "@angular/core";
export declare class ProcessService {
    private trackingService;
    private http;
    constructor(trackingService: TrackingService, http: HttpClient);
    get(domainId: string): Observable<Process[]>;
    getById(domainId: string, processId: string): Observable<Process>;
    save(process: Process): Observable<any>;
    execute(domainId: string, processObjectId: string, inputs: {
        code: string;
        value: any;
    }[], executionMode?: string): Observable<any>;
    continue(domainId: string, executionId: string, inputs: {
        id: string;
        value: any;
    }[]): Observable<any>;
    continueOverridingStage(domainId: string, executionId: string, inputs: {
        id: string;
        value: any;
    }[], overrideStageIndex: number): Observable<any>;
    static ɵfac: i0.ɵɵFactoryDef<ProcessService, never>;
    static ɵprov: i0.ɵɵInjectableDef<ProcessService>;
}
