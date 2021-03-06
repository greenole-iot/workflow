import { EventService, StateService, TrackingWebsocketService, EventWebsocketService, TrackingService } from '@alis/ng-base';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ExecutionDTO } from './model/executionDTO';
import { Process } from './model/process';
import { EventDTO } from './model/eventDTO';
import { YieldResult } from './model/yieldResult';
import * as i0 from "@angular/core";
export declare class ExecutionService {
    private stateService;
    private trackingService;
    private http;
    private trackingWebsocketService;
    private eventService;
    private eventWebsocketService;
    constructor(stateService: StateService, trackingService: TrackingService, http: HttpClient, trackingWebsocketService: TrackingWebsocketService, eventService: EventService, eventWebsocketService: EventWebsocketService);
    getYieldResult(domainId: string, executionId: string, yieldResultId: string): Observable<YieldResult>;
    getYieldResults(domainId: string, executionId: string): Observable<YieldResult[]>;
    getExecutionEventsByWs(domainId: string, processId: string, executionId: string, filter: any): Observable<EventDTO>;
    getExecutionTracesByWs(domainId: string, processId: string, executionId: string, filter: any): Observable<ExecutionDTO>;
    getExecutionsByWs(domainId: string, processId: string, filter: any): Observable<ExecutionDTO>;
    getExecutionTraces(domainId: string, executionId: string, startTimestamp: string): Observable<ExecutionDTO[]>;
    getExecutionTracesPoll(domainId: string, executionId: string, startTimestamp: string): Observable<ExecutionDTO[]>;
    getExecutions(domainId: string, processId: string): Observable<ExecutionDTO[]>;
    getExecutionsPoll(domainId: string, processId: string): Observable<ExecutionDTO[]>;
    closeWebsocket(): void;
    getLatestEnded(processes: Process[]): Observable<ExecutionDTO[]>;
    getLastExecution(domainId: string, id: string): Observable<ExecutionDTO>;
    get(domainId: string, id: string): Observable<ExecutionDTO>;
    getEvents(domainId: string, executionId: string, startTimestamp: number): Observable<EventDTO[]>;
    getEventsPoll(domainId: string, executionId: string, startTimestamp: number): Observable<EventDTO[]>;
    private processAurionTrace;
    private processAurionEvent;
    static ??fac: i0.????FactoryDef<ExecutionService, never>;
    static ??prov: i0.????InjectableDef<ExecutionService>;
}
