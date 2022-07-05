import { PropertiesService, StateService, TrackingService, TrackingWebsocketService, EventService, EventWebsocketService, NgBaseLibModule } from '@alis/ng-base';
import { ɵɵinject, ɵɵdefineInjectable, ɵsetClassMetadata, Injectable, ɵɵdefineNgModule, ɵɵdefineInjector, ɵɵsetNgModuleScope, NgModule } from '@angular/core';
import * as moment from 'moment';
import { forkJoin } from 'rxjs';
import { map, retryWhen, delay, repeat } from 'rxjs/operators';
import { HttpClient, HttpClientModule, HttpHeaders, HttpParams } from '@angular/common/http';
import { __awaiter } from 'tslib';

class ExecutionService {
    constructor(stateService, trackingService, http, trackingWebsocketService, eventService, eventWebsocketService) {
        this.stateService = stateService;
        this.trackingService = trackingService;
        this.http = http;
        this.trackingWebsocketService = trackingWebsocketService;
        this.eventService = eventService;
        this.eventWebsocketService = eventWebsocketService;
    }
    getYieldResult(domainId, executionId, yieldResultId) {
        const url = `${PropertiesService.properties.fileServiceUrl}/execution/yieldResult/${domainId}/${executionId}/${yieldResultId}`;
        return this.http.get(url);
    }
    getYieldResults(domainId, executionId) {
        const url = `${PropertiesService.properties.fileServiceUrl}/execution/yieldResult/${domainId}/${executionId}`;
        return this.http.get(url);
    }
    getExecutionEventsByWs(domainId, processId, executionId, filter) {
        return this.eventWebsocketService.connect(filter).pipe(map((event) => {
            if (event != null && event.domainId === domainId && event.processId === processId && event.executionId === executionId) {
                return this.processAurionEvent(event);
            }
        })).pipe(retryWhen(errors => errors.pipe(delay(1000))));
    }
    getExecutionTracesByWs(domainId, processId, executionId, filter) {
        return this.trackingWebsocketService.connect(filter).pipe(map((trace) => {
            const execution = trace;
            if (execution != null && execution.domainId === domainId && execution.processId === processId && execution.objectId === executionId) {
                return this.processAurionTrace(execution);
            }
        })).pipe(retryWhen(errors => errors.pipe(delay(1000))));
    }
    getExecutionsByWs(domainId, processId, filter) {
        return this.trackingWebsocketService.connect(filter).pipe(map((trace) => {
            const execution = trace;
            if (execution != null && execution.domainId === domainId && execution.processId === processId) {
                return this.processAurionTrace(execution);
            }
        })).pipe(retryWhen(errors => errors.pipe(delay(1000))));
    }
    getExecutionTraces(domainId, executionId, startTimestamp) {
        return this.trackingService.get(domainId, 'execution', executionId, startTimestamp).pipe(map((traces) => {
            return traces.map(item => this.processAurionTrace(item));
        }));
    }
    getExecutionTracesPoll(domainId, executionId, startTimestamp) {
        return this.trackingService.get(domainId, 'execution', executionId, startTimestamp).pipe(map((traces) => {
            return traces.map(item => this.processAurionTrace(item));
        })).pipe(delay(15000)).pipe(repeat());
    }
    getExecutions(domainId, processId) {
        return this.stateService.searchExecutionsByProcess(domainId, 'execution', processId).pipe(map((traces) => {
            return traces.map(item => this.processAurionTrace(item));
        }));
    }
    getExecutionsPoll(domainId, processId) {
        return this.stateService.searchExecutionsByProcess(domainId, 'execution', processId).pipe(map((traces) => {
            return traces.map(item => this.processAurionTrace(item));
        })).pipe(delay(30000)).pipe(repeat());
    }
    closeWebsocket() {
        if (PropertiesService.properties.trackingwebsocket) {
            this.trackingWebsocketService.disconnect();
        }
    }
    getLatestEnded(processes) {
        return forkJoin(processes.map(process => this.getLastExecution(process.domainId, process.objectId)));
    }
    getLastExecution(domainId, id) {
        return this.stateService.searchExecutionsByProcess(domainId, 'execution', id).pipe(map((states) => {
            if (states == null || states.length === 0) {
                return null;
            }
            return this.processAurionTrace(states[0]);
        }));
    }
    get(domainId, id) {
        return this.stateService.get(domainId, 'execution', id).pipe(map((state) => {
            if (state == null) {
                return null;
            }
            return this.processAurionTrace(state);
        }));
    }
    getEvents(domainId, executionId, startTimestamp) {
        return this.eventService.getEventsBySubject(domainId, 'execution', startTimestamp, "executionId.eq:" + executionId).pipe(map((events) => {
            return events.map(event => this.processAurionEvent(event));
        }));
    }
    getEventsPoll(domainId, executionId, startTimestamp) {
        return this.eventService.getEventsBySubject(domainId, 'execution', startTimestamp, "executionId.eq:" + executionId).pipe(map((events) => {
            return events.map(event => this.processAurionEvent(event));
        })).pipe(delay(1000)).pipe(repeat());
        ;
    }
    processAurionTrace(trace) {
        let execution = trace;
        execution.timestampStartPretty = trace.startedAt ? moment(trace.startedAt).format('DD/MM/YYYY HH:mm:ss') : undefined;
        execution.timestampFinalPretty = trace.finishedAt ? moment(trace.finishedAt).format('DD/MM/YYYY HH:mm:ss') : undefined;
        execution.timeEllapsedPretty = trace.executionTime ? (trace.executionTime / 1000) + 's' : null;
        execution.timestampPretty = trace.timestamp ? moment(trace.timestamp).format('DD/MM/YYYY HH:mm:ss') : undefined;
        return execution;
    }
    processAurionEvent(event) {
        let executionEvent = event;
        executionEvent.timestampPretty = event.timestamp ? moment(event.timestamp).format('DD/MM/YYYY HH:mm:ss') : undefined;
        return executionEvent;
    }
}
ExecutionService.ɵfac = function ExecutionService_Factory(t) { return new (t || ExecutionService)(ɵɵinject(StateService), ɵɵinject(TrackingService), ɵɵinject(HttpClient), ɵɵinject(TrackingWebsocketService), ɵɵinject(EventService), ɵɵinject(EventWebsocketService)); };
ExecutionService.ɵprov = ɵɵdefineInjectable({ token: ExecutionService, factory: ExecutionService.ɵfac, providedIn: 'root' });
/*@__PURE__*/ (function () { ɵsetClassMetadata(ExecutionService, [{
        type: Injectable,
        args: [{
                providedIn: 'root'
            }]
    }], function () { return [{ type: StateService }, { type: TrackingService }, { type: HttpClient }, { type: TrackingWebsocketService }, { type: EventService }, { type: EventWebsocketService }]; }, null); })();

class Event {
}

class EventDTO extends Event {
}

class Execution {
}

class ExecutionDTO extends Execution {
}

class Schedule {
    constructor() { }
}

class Process {
}

class ParametersDefinition {
    constructor() { }
}

class EntryInput {
    constructor() { }
}

class InputDefinition {
    constructor() { }
}

class DataSource {
    constructor() { }
}

class ProcessStep {
}

class ProcessService {
    constructor(trackingService, http) {
        this.trackingService = trackingService;
        this.http = http;
    }
    /*
    cadu  3:15 PM
    na doc da modelagem do workflows eu tive q adicionar na Execução 2 campos, o context e location
    context é o cliente (AES) e location é o processo
    */
    get(domainId) {
        return this.trackingService.getByType(domainId, 'process').pipe(map((traces) => {
            return traces.map(trace => {
                return trace;
            });
        }));
    }
    getById(domainId, processId) {
        return this.get(domainId).pipe(map(items => {
            return items.find(item => item.objectId == processId);
        }));
    }
    save(process) {
        return this.trackingService.set(process);
    }
    execute(domainId, processObjectId, inputs, executionMode = "default") {
        let url = `${PropertiesService.properties.fileServiceUrl}/execution/start/${domainId}/${processObjectId}`;
        let userJSON = sessionStorage.getItem('user');
        let user = userJSON != null && userJSON != '' ? JSON.parse(userJSON) : "";
        // let inputsPostFormat = inputs.reduce((prev, cur) => { prev[cur.id] = cur.value; return prev }, {});
        return this.http.post(url, { processId: processObjectId, inputs: inputs, executionMode: executionMode }, {
            headers: {
                'Authorization': 'Bearer ' + user.idToken
            }
        });
    }
    continue(domainId, executionId, inputs) {
        var _a;
        let url = `${PropertiesService.properties.fileServiceUrl}/execution/${domainId}/${executionId}/continue`;
        let userJSON = sessionStorage.getItem('user');
        const parsedUserJSON = userJSON != null && userJSON != '' ? JSON.parse(userJSON) : "";
        let payload = {
            domainId: domainId,
            executionId: executionId,
            inputs: inputs,
            user: ((_a = parsedUserJSON.idTokenPayload) === null || _a === void 0 ? void 0 : _a.nickname) || "",
        };
        return this.http.post(url, payload, {
            headers: {
                'Authorization': 'Bearer ' + parsedUserJSON.idToken
            },
            responseType: 'text'
        });
    }
    //continue overriding stageIndex
    continueOverridingStage(domainId, executionId, inputs, overrideStageIndex) {
        let url = `${PropertiesService.properties.fileServiceUrl}/execution/${domainId}/${executionId}/continue?overrideStageIndex=${overrideStageIndex}`;
        let userJSON = sessionStorage.getItem('user');
        const parsedUserJSON = userJSON != null && userJSON != '' ? JSON.parse(userJSON) : "";
        let payload = {
            inputs: inputs
        };
        return this.http.post(url, payload, {
            headers: {
                'Authorization': 'Bearer ' + parsedUserJSON.idToken
            },
            responseType: 'text'
        });
    }
}
ProcessService.ɵfac = function ProcessService_Factory(t) { return new (t || ProcessService)(ɵɵinject(TrackingService), ɵɵinject(HttpClient)); };
ProcessService.ɵprov = ɵɵdefineInjectable({ token: ProcessService, factory: ProcessService.ɵfac, providedIn: 'root' });
/*@__PURE__*/ (function () { ɵsetClassMetadata(ProcessService, [{
        type: Injectable,
        args: [{
                providedIn: 'root'
            }]
    }], function () { return [{ type: TrackingService }, { type: HttpClient }]; }, null); })();

class WorkflowLibModule {
    constructor(propertiesService) {
        this.propertiesService = propertiesService;
        this.ready = false;
        this.propertiesService.readAllProperties().subscribe(() => {
            this.ready = true;
        });
    }
}
WorkflowLibModule.ɵmod = ɵɵdefineNgModule({ type: WorkflowLibModule });
WorkflowLibModule.ɵinj = ɵɵdefineInjector({ factory: function WorkflowLibModule_Factory(t) { return new (t || WorkflowLibModule)(ɵɵinject(PropertiesService)); }, imports: [[
            NgBaseLibModule,
            HttpClientModule
        ]] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && ɵɵsetNgModuleScope(WorkflowLibModule, { imports: [NgBaseLibModule,
        HttpClientModule] }); })();
/*@__PURE__*/ (function () { ɵsetClassMetadata(WorkflowLibModule, [{
        type: NgModule,
        args: [{
                declarations: [],
                imports: [
                    NgBaseLibModule,
                    HttpClientModule
                ],
                exports: []
            }]
    }], function () { return [{ type: PropertiesService }]; }, null); })();

class FileServiceMetadata {
    static fromFile(domainId, file, user) {
        let fileServiceMetadata = new FileServiceMetadata();
        fileServiceMetadata.domainId = domainId;
        fileServiceMetadata.subDomainId = "users";
        fileServiceMetadata.name = file.name;
        fileServiceMetadata.type = file.name.substring(file.name.lastIndexOf(".") + 1);
        fileServiceMetadata.timestamp = Date.now();
        fileServiceMetadata.tags = null;
        fileServiceMetadata.entryType = "FILE";
        fileServiceMetadata.size = file.size;
        fileServiceMetadata.path = [
            fileServiceMetadata.domainId,
            fileServiceMetadata.subDomainId,
            user
        ];
        return fileServiceMetadata;
    }
    isFolder() {
        return "DIRECTORY" === this.entryType;
    }
}

class FileServiceMetadataService {
    constructor(http) {
        this.http = http;
    }
    removeMetadata(domainId, fileObjectId, repository) {
        let url = repository || PropertiesService.properties.fileServiceUrl + "/fileservice/file";
        let options = {
            headers: new HttpHeaders()
                .set("accept", "*/*"),
            params: new HttpParams()
                .set("domainId", domainId)
                .set("id", fileObjectId)
        };
        return this.http.delete(url, options);
    }
    removeFile(removeLink) {
        return this.http.delete(removeLink);
    }
    uploadMetadata(newFileServiceMetadata, repository) {
        let url = repository || PropertiesService.properties.fileServiceUrl + "/fileservice/file";
        let options = {
            headers: new HttpHeaders()
                .set("accept", "*/*")
                .set("content-type", "application/json")
        };
        return this.http.post(url, newFileServiceMetadata, options);
    }
    /*
      obs: the headers received by this method, comes in this format:
      {
        <header1>: <header1 value>,
        <header2>: <header2 value>
        .
        .
        .
      }
  
      when receiving headers as HttpHeaders, built by the service consumer,
      the headers that were added goes to "lazyUpdate" field inside HttpHeaders
      instance instead "headers" field, which leads to CORS error due those mandatory
      headers are not been sent.
  
      in order to solve this, the "headers" object, demanded by HttpClient methods,
      accepts a plain JSON object. therefore, the service consumer should send
      "headers" as a plain JSON object.
    */
    uploadFile(uploadLink, file, headers) {
        let options = {
            headers: headers
        };
        return this.http.put(uploadLink, file, options);
    }
    //TODO - verificar se existe uma forma de já buscar os metadados ordenados através do indexing;
    //o mesmo vale para processos e execuções; enquanto isso, o front ordena as listas quando necessário
    /**
     *
     * @param domainId
     * @param path
     * @param repository
     * @param query HTTP List of filters using the Aurion SearchCriteria pattern: key.operation:filterValue[,otherFilterValue]. Operations: eq/neq/sw/gt/egt/lt/elt. (ex: attribute1.eq:testValue)
     */
    list(domainId, path, strictly, repository, query) {
        let url = repository || PropertiesService.properties.fileServiceUrl + "/fileservice/list";
        let params = new HttpParams()
            .set("domainId", domainId)
            .set("path", path)
            .set("locationStrictly", strictly != null ? "" + strictly : "false");
        if (query != null) {
            params = params.set('query', query);
        }
        let options = {
            headers: new HttpHeaders().set("accept", "*/*"),
            params: params
        };
        return this.http.get(url, options).pipe(map((fileServiceMetadatas) => {
            return fileServiceMetadatas.sort((a, b) => {
                return a.creationDateTimestamp > b.creationDateTimestamp ? -1 : 1;
            });
        }));
    }
    getFileDetail(domainId, fileId, repository) {
        let url = repository || PropertiesService.properties.fileServiceUrl + "/fileservice/file";
        let options = {
            headers: new HttpHeaders()
                .set("accept", "*/*"),
            params: new HttpParams()
                .set("domainId", domainId)
                .set("id", fileId)
        };
        return this.http.get(url, options);
    }
    downloadFile(fileMetadata) {
        this.getFileDetail(fileMetadata.domainId, fileMetadata.objectId).subscribe(fileDetail => {
            if (fileDetail != null) {
                const link = fileDetail.metadata.link ? fileDetail.metadata.link : fileDetail['link'];
                const metadata = fileDetail['metadata'];
                if (metadata == null) {
                    console.warn('metadata received is null');
                    return null;
                }
                let fileName = metadata.name;
                this.download(link, fileName);
            }
            else {
                console.error("response is null", fileDetail);
            }
        }, (error) => {
            console.error(error);
        });
    }
    download(url, fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            const a = document.createElement("a");
            a.href = yield this.toDataURL(url);
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
        });
    }
    toDataURL(url) {
        return fetch(url).then((response) => {
            return response.blob();
        }).then(blob => {
            return URL.createObjectURL(blob);
        });
    }
    getBytes(fileId, repository) {
        return null;
    }
}
FileServiceMetadataService.ɵfac = function FileServiceMetadataService_Factory(t) { return new (t || FileServiceMetadataService)(ɵɵinject(HttpClient)); };
FileServiceMetadataService.ɵprov = ɵɵdefineInjectable({ token: FileServiceMetadataService, factory: FileServiceMetadataService.ɵfac, providedIn: 'root' });
/*@__PURE__*/ (function () { ɵsetClassMetadata(FileServiceMetadataService, [{
        type: Injectable,
        args: [{
                providedIn: 'root'
            }]
    }], function () { return [{ type: HttpClient }]; }, null); })();

class ScheduleService {
    constructor(http) {
        this.http = http;
    }
    // GET /schedule/{domainId}/process/{processId}
    getProcessSchedules(domainId, processId) {
        const url = PropertiesService.properties.scheduleServiceUrl + "/" + domainId + "/process/" + processId;
        return this.http.get(url);
    }
    // POST /schedule/{domainId}/{processId}
    createOrUpdateSchedule(domainId, processId, schedule) {
        const url = PropertiesService.properties.scheduleServiceUrl + "/" + domainId + "/" + processId;
        schedule.processId = schedule.processId || processId;
        return this.http.post(url, schedule, { responseType: 'text' });
    }
    // DELETE /schedule/{domainId}/{scheduleId}
    deleteSchedule(domainId, scheduleId) {
        const url = PropertiesService.properties.scheduleServiceUrl + "/" + domainId + "/" + scheduleId;
        return this.http.delete(url);
    }
}
ScheduleService.ɵfac = function ScheduleService_Factory(t) { return new (t || ScheduleService)(ɵɵinject(HttpClient)); };
ScheduleService.ɵprov = ɵɵdefineInjectable({ token: ScheduleService, factory: ScheduleService.ɵfac, providedIn: 'root' });
/*@__PURE__*/ (function () { ɵsetClassMetadata(ScheduleService, [{
        type: Injectable,
        args: [{
                providedIn: 'root'
            }]
    }], function () { return [{ type: HttpClient }]; }, null); })();

/*
 * Public API Surface of workflow
 */

/**
 * Generated bundle index. Do not edit.
 */

export { DataSource, EntryInput, Event, EventDTO, Execution, ExecutionDTO, ExecutionService, FileServiceMetadata, FileServiceMetadataService, InputDefinition, ParametersDefinition, Process, ProcessService, ProcessStep, Schedule, ScheduleService, WorkflowLibModule };
//# sourceMappingURL=alis-workflow.js.map
