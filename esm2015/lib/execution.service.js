import { PropertiesService } from '@alis/ng-base';
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { forkJoin } from 'rxjs';
import { delay, map, repeat, retryWhen } from 'rxjs/operators';
import * as i0 from "@angular/core";
import * as i1 from "@alis/ng-base";
import * as i2 from "@angular/common/http";
export class ExecutionService {
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
ExecutionService.ɵfac = function ExecutionService_Factory(t) { return new (t || ExecutionService)(i0.ɵɵinject(i1.StateService), i0.ɵɵinject(i1.TrackingService), i0.ɵɵinject(i2.HttpClient), i0.ɵɵinject(i1.TrackingWebsocketService), i0.ɵɵinject(i1.EventService), i0.ɵɵinject(i1.EventWebsocketService)); };
ExecutionService.ɵprov = i0.ɵɵdefineInjectable({ token: ExecutionService, factory: ExecutionService.ɵfac, providedIn: 'root' });
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(ExecutionService, [{
        type: Injectable,
        args: [{
                providedIn: 'root'
            }]
    }], function () { return [{ type: i1.StateService }, { type: i1.TrackingService }, { type: i2.HttpClient }, { type: i1.TrackingWebsocketService }, { type: i1.EventService }, { type: i1.EventWebsocketService }]; }, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhlY3V0aW9uLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy93b3JrZmxvdy9zcmMvbGliL2V4ZWN1dGlvbi5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBZ0IsaUJBQWlCLEVBQWdHLE1BQU0sZUFBZSxDQUFDO0FBRTlKLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxLQUFLLE1BQU0sTUFBTSxRQUFRLENBQUM7QUFDakMsT0FBTyxFQUFFLFFBQVEsRUFBYyxNQUFNLE1BQU0sQ0FBQztBQUM1QyxPQUFPLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFVLE1BQU0sZ0JBQWdCLENBQUM7Ozs7QUFXdkUsTUFBTSxPQUFPLGdCQUFnQjtJQUMzQixZQUFvQixZQUEwQixFQUFVLGVBQWdDLEVBQVUsSUFBZ0IsRUFBVSx3QkFBa0QsRUFBVSxZQUEwQixFQUFVLHFCQUE0QztRQUFwUCxpQkFBWSxHQUFaLFlBQVksQ0FBYztRQUFVLG9CQUFlLEdBQWYsZUFBZSxDQUFpQjtRQUFVLFNBQUksR0FBSixJQUFJLENBQVk7UUFBVSw2QkFBd0IsR0FBeEIsd0JBQXdCLENBQTBCO1FBQVUsaUJBQVksR0FBWixZQUFZLENBQWM7UUFBVSwwQkFBcUIsR0FBckIscUJBQXFCLENBQXVCO0lBQUksQ0FBQztJQUc3USxjQUFjLENBQUMsUUFBZ0IsRUFBRSxXQUFtQixFQUFFLGFBQXFCO1FBQ3pFLE1BQU0sR0FBRyxHQUFHLEdBQUcsaUJBQWlCLENBQUMsVUFBVSxDQUFDLGNBQWMsMEJBQTBCLFFBQVEsSUFBSSxXQUFXLElBQUksYUFBYSxFQUFFLENBQUM7UUFDL0gsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBYyxHQUFHLENBQUMsQ0FBQztJQUN6QyxDQUFDO0lBRUQsZUFBZSxDQUFDLFFBQWdCLEVBQUUsV0FBbUI7UUFDbkQsTUFBTSxHQUFHLEdBQUcsR0FBRyxpQkFBaUIsQ0FBQyxVQUFVLENBQUMsY0FBYywwQkFBMEIsUUFBUSxJQUFJLFdBQVcsRUFBRSxDQUFDO1FBQzlHLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQWdCLEdBQUcsQ0FBQyxDQUFDO0lBQzNDLENBQUM7SUFHRCxzQkFBc0IsQ0FBQyxRQUFnQixFQUFFLFNBQWlCLEVBQUUsV0FBbUIsRUFBRSxNQUFXO1FBQzFGLE9BQU8sSUFBSSxDQUFDLHFCQUFxQixDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBWSxFQUFFLEVBQUU7WUFDMUUsSUFBRyxLQUFLLElBQUksSUFBSSxJQUFJLEtBQUssQ0FBQyxRQUFRLEtBQUssUUFBUSxJQUFJLEtBQUssQ0FBQyxTQUFTLEtBQUssU0FBUyxJQUFJLEtBQUssQ0FBQyxXQUFXLEtBQUssV0FBVyxFQUFDO2dCQUNwSCxPQUFPLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLLENBQUMsQ0FBQzthQUN2QztRQUNILENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUMxQixNQUFNLENBQUMsSUFBSSxDQUNULEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FDWixDQUFDLENBQUMsQ0FBQTtJQUNQLENBQUM7SUFHRCxzQkFBc0IsQ0FBQyxRQUFnQixFQUFFLFNBQWlCLEVBQUUsV0FBbUIsRUFBRSxNQUFXO1FBQzFGLE9BQU8sSUFBSSxDQUFDLHdCQUF3QixDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBVSxFQUFFLEVBQUU7WUFDM0UsTUFBTSxTQUFTLEdBQWMsS0FBa0IsQ0FBQztZQUNoRCxJQUFJLFNBQVMsSUFBSSxJQUFJLElBQUksU0FBUyxDQUFDLFFBQVEsS0FBSyxRQUFRLElBQUksU0FBUyxDQUFDLFNBQVMsS0FBSyxTQUFTLElBQUksU0FBUyxDQUFDLFFBQVEsS0FBSyxXQUFXLEVBQUU7Z0JBQ2pJLE9BQU8sSUFBSSxDQUFDLGtCQUFrQixDQUFDLFNBQVMsQ0FBQyxDQUFDO2FBQzdDO1FBQ0gsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQzFCLE1BQU0sQ0FBQyxJQUFJLENBQ1QsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUNaLENBQUMsQ0FBQyxDQUFBO0lBQ1AsQ0FBQztJQUdELGlCQUFpQixDQUFDLFFBQWdCLEVBQUUsU0FBaUIsRUFBRSxNQUFXO1FBQ2hFLE9BQU8sSUFBSSxDQUFDLHdCQUF3QixDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBVSxFQUFFLEVBQUU7WUFDM0UsTUFBTSxTQUFTLEdBQWMsS0FBa0IsQ0FBQztZQUNoRCxJQUFJLFNBQVMsSUFBSSxJQUFJLElBQUksU0FBUyxDQUFDLFFBQVEsS0FBSyxRQUFRLElBQUksU0FBUyxDQUFDLFNBQVMsS0FBSyxTQUFTLEVBQUU7Z0JBQzNGLE9BQU8sSUFBSSxDQUFDLGtCQUFrQixDQUFDLFNBQVMsQ0FBQyxDQUFDO2FBQzdDO1FBQ0gsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQzFCLE1BQU0sQ0FBQyxJQUFJLENBQ1QsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUNaLENBQUMsQ0FBQyxDQUFBO0lBQ1AsQ0FBQztJQUVELGtCQUFrQixDQUFDLFFBQWdCLEVBQUUsV0FBbUIsRUFBRSxjQUFzQjtRQUM5RSxPQUFPLElBQUksQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxXQUFXLEVBQUUsV0FBVyxFQUFFLGNBQWMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFvQixFQUFFLEVBQUU7WUFDcEgsT0FBTyxNQUFNLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDM0QsQ0FBQyxDQUFDLENBQUMsQ0FBQTtJQUNMLENBQUM7SUFFRCxzQkFBc0IsQ0FBQyxRQUFnQixFQUFFLFdBQW1CLEVBQUUsY0FBc0I7UUFDbEYsT0FBTyxJQUFJLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsV0FBVyxFQUFFLFdBQVcsRUFBRSxjQUFjLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBb0IsRUFBRSxFQUFFO1lBQ3BILE9BQU8sTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQzNELENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO0lBQ3hDLENBQUM7SUFHRCxhQUFhLENBQUMsUUFBZ0IsRUFBRSxTQUFpQjtRQUMvQyxPQUFPLElBQUksQ0FBQyxZQUFZLENBQUMseUJBQXlCLENBQUMsUUFBUSxFQUFFLFdBQVcsRUFBRSxTQUFTLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBb0IsRUFBRSxFQUFFO1lBQ3JILE9BQU8sTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQzNELENBQUMsQ0FBQyxDQUFDLENBQUE7SUFDTCxDQUFDO0lBRUQsaUJBQWlCLENBQUMsUUFBZ0IsRUFBRSxTQUFpQjtRQUNuRCxPQUFPLElBQUksQ0FBQyxZQUFZLENBQUMseUJBQXlCLENBQUMsUUFBUSxFQUFFLFdBQVcsRUFBRSxTQUFTLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBb0IsRUFBRSxFQUFFO1lBQ3JILE9BQU8sTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQzNELENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO0lBQ3hDLENBQUM7SUFFRCxjQUFjO1FBQ1osSUFBSSxpQkFBaUIsQ0FBQyxVQUFVLENBQUMsaUJBQWlCLEVBQUU7WUFDbEQsSUFBSSxDQUFDLHdCQUF3QixDQUFDLFVBQVUsRUFBRSxDQUFDO1NBQzVDO0lBQ0gsQ0FBQztJQUVELGNBQWMsQ0FBQyxTQUFvQjtRQUNqQyxPQUFPLFFBQVEsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN2RyxDQUFDO0lBRUQsZ0JBQWdCLENBQUMsUUFBZ0IsRUFBRSxFQUFVO1FBQzNDLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyx5QkFBeUIsQ0FBQyxRQUFRLEVBQUUsV0FBVyxFQUFFLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFvQixFQUFFLEVBQUU7WUFDOUcsSUFBSSxNQUFNLElBQUksSUFBSSxJQUFJLE1BQU0sQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO2dCQUN6QyxPQUFPLElBQUksQ0FBQzthQUNiO1lBQ0QsT0FBTyxJQUFJLENBQUMsa0JBQWtCLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDNUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNOLENBQUM7SUFFRCxHQUFHLENBQUMsUUFBZ0IsRUFBRSxFQUFVO1FBQzlCLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLFdBQVcsRUFBRSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUU7WUFDekUsSUFBSSxLQUFLLElBQUksSUFBSSxFQUFFO2dCQUNqQixPQUFPLElBQUksQ0FBQzthQUNiO1lBQ0QsT0FBTyxJQUFJLENBQUMsa0JBQWtCLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDeEMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNOLENBQUM7SUFFRCxTQUFTLENBQUMsUUFBZ0IsRUFBRSxXQUFtQixFQUFFLGNBQXNCO1FBQ3JFLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyxrQkFBa0IsQ0FBQyxRQUFRLEVBQUUsV0FBVyxFQUFFLGNBQWMsRUFBRSxpQkFBaUIsR0FBRyxXQUFXLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFFLENBQUMsTUFBb0IsRUFBRSxFQUFFO1lBQ3JKLE9BQU8sTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQzdELENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDTixDQUFDO0lBRUQsYUFBYSxDQUFDLFFBQWdCLEVBQUUsV0FBbUIsRUFBRSxjQUFzQjtRQUN6RSxPQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsa0JBQWtCLENBQUMsUUFBUSxFQUFFLFdBQVcsRUFBRSxjQUFjLEVBQUUsaUJBQWlCLEdBQUcsV0FBVyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBRSxDQUFDLE1BQW9CLEVBQUUsRUFBRTtZQUNySixPQUFPLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUM3RCxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztRQUFBLENBQUM7SUFDeEMsQ0FBQztJQUVPLGtCQUFrQixDQUFDLEtBQVU7UUFDbkMsSUFBSSxTQUFTLEdBQUcsS0FBcUIsQ0FBQztRQUV0QyxTQUFTLENBQUMsb0JBQW9CLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxNQUFNLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO1FBQ3JILFNBQVMsQ0FBQyxvQkFBb0IsR0FBRyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUM7UUFDdkgsU0FBUyxDQUFDLGtCQUFrQixHQUFHLEtBQUssQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQTtRQUM5RixTQUFTLENBQUMsZUFBZSxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsTUFBTSxDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQztRQUNoSCxPQUFPLFNBQVMsQ0FBQztJQUNuQixDQUFDO0lBRU8sa0JBQWtCLENBQUMsS0FBVTtRQUNuQyxJQUFJLGNBQWMsR0FBRyxLQUFpQixDQUFDO1FBQ3ZDLGNBQWMsQ0FBQyxlQUFlLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxNQUFNLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO1FBQ3JILE9BQU8sY0FBYyxDQUFDO0lBQ3hCLENBQUM7O2dGQW5JVSxnQkFBZ0I7d0RBQWhCLGdCQUFnQixXQUFoQixnQkFBZ0IsbUJBRmYsTUFBTTtrREFFUCxnQkFBZ0I7Y0FINUIsVUFBVTtlQUFDO2dCQUNWLFVBQVUsRUFBRSxNQUFNO2FBQ25CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRXZlbnRTZXJ2aWNlLCBQcm9wZXJ0aWVzU2VydmljZSwgU3RhdGVTZXJ2aWNlLCBUcmFjZSwgRXZlbnQsIFRyYWNraW5nV2Vic29ja2V0U2VydmljZSwgRXZlbnRXZWJzb2NrZXRTZXJ2aWNlLCBUcmFja2luZ1NlcnZpY2UgfSBmcm9tICdAYWxpcy9uZy1iYXNlJztcbmltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XG5pbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgKiBhcyBtb21lbnQgZnJvbSAnbW9tZW50JztcbmltcG9ydCB7IGZvcmtKb2luLCBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBkZWxheSwgbWFwLCByZXBlYXQsIHJldHJ5V2hlbiwgZmlsdGVyIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHsgRXhlY3V0aW9uRFRPIH0gZnJvbSAnLi9tb2RlbC9leGVjdXRpb25EVE8nO1xuaW1wb3J0IHsgUHJvY2VzcyB9IGZyb20gJy4vbW9kZWwvcHJvY2Vzcyc7XG5pbXBvcnQgeyBFdmVudERUTyB9IGZyb20gJy4vbW9kZWwvZXZlbnREVE8nO1xuaW1wb3J0IHsgRXhlY3V0aW9uIH0gZnJvbSAnLi9tb2RlbC9leGVjdXRpb24nO1xuaW1wb3J0IHsgWWllbGRSZXN1bHQgfSBmcm9tICcuL21vZGVsL3lpZWxkUmVzdWx0JztcblxuXG5ASW5qZWN0YWJsZSh7XG4gIHByb3ZpZGVkSW46ICdyb290J1xufSlcbmV4cG9ydCBjbGFzcyBFeGVjdXRpb25TZXJ2aWNlIHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBzdGF0ZVNlcnZpY2U6IFN0YXRlU2VydmljZSwgcHJpdmF0ZSB0cmFja2luZ1NlcnZpY2U6IFRyYWNraW5nU2VydmljZSwgcHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50LCBwcml2YXRlIHRyYWNraW5nV2Vic29ja2V0U2VydmljZTogVHJhY2tpbmdXZWJzb2NrZXRTZXJ2aWNlLCBwcml2YXRlIGV2ZW50U2VydmljZTogRXZlbnRTZXJ2aWNlLCBwcml2YXRlIGV2ZW50V2Vic29ja2V0U2VydmljZTogRXZlbnRXZWJzb2NrZXRTZXJ2aWNlKSB7IH1cblxuXG4gIGdldFlpZWxkUmVzdWx0KGRvbWFpbklkOiBzdHJpbmcsIGV4ZWN1dGlvbklkOiBzdHJpbmcsIHlpZWxkUmVzdWx0SWQ6IHN0cmluZyk6IE9ic2VydmFibGU8WWllbGRSZXN1bHQ+IHtcbiAgICBjb25zdCB1cmwgPSBgJHtQcm9wZXJ0aWVzU2VydmljZS5wcm9wZXJ0aWVzLmZpbGVTZXJ2aWNlVXJsfS9leGVjdXRpb24veWllbGRSZXN1bHQvJHtkb21haW5JZH0vJHtleGVjdXRpb25JZH0vJHt5aWVsZFJlc3VsdElkfWA7XG4gICAgcmV0dXJuIHRoaXMuaHR0cC5nZXQ8WWllbGRSZXN1bHQ+KHVybCk7XG4gIH1cblxuICBnZXRZaWVsZFJlc3VsdHMoZG9tYWluSWQ6IHN0cmluZywgZXhlY3V0aW9uSWQ6IHN0cmluZyk6IE9ic2VydmFibGU8WWllbGRSZXN1bHRbXT4ge1xuICAgIGNvbnN0IHVybCA9IGAke1Byb3BlcnRpZXNTZXJ2aWNlLnByb3BlcnRpZXMuZmlsZVNlcnZpY2VVcmx9L2V4ZWN1dGlvbi95aWVsZFJlc3VsdC8ke2RvbWFpbklkfS8ke2V4ZWN1dGlvbklkfWA7XG4gICAgcmV0dXJuIHRoaXMuaHR0cC5nZXQ8WWllbGRSZXN1bHRbXT4odXJsKTtcbiAgfVxuXG5cbiAgZ2V0RXhlY3V0aW9uRXZlbnRzQnlXcyhkb21haW5JZDogc3RyaW5nLCBwcm9jZXNzSWQ6IHN0cmluZywgZXhlY3V0aW9uSWQ6IHN0cmluZywgZmlsdGVyOiBhbnkpOiBPYnNlcnZhYmxlPEV2ZW50RFRPPiB7XG4gICAgcmV0dXJuIHRoaXMuZXZlbnRXZWJzb2NrZXRTZXJ2aWNlLmNvbm5lY3QoZmlsdGVyKS5waXBlKG1hcCgoZXZlbnQ6IEV2ZW50KSA9PiB7XG4gICAgICBpZihldmVudCAhPSBudWxsICYmIGV2ZW50LmRvbWFpbklkID09PSBkb21haW5JZCAmJiBldmVudC5wcm9jZXNzSWQgPT09IHByb2Nlc3NJZCAmJiBldmVudC5leGVjdXRpb25JZCA9PT0gZXhlY3V0aW9uSWQpe1xuICAgICAgICByZXR1cm4gdGhpcy5wcm9jZXNzQXVyaW9uRXZlbnQoZXZlbnQpO1xuICAgICAgfVxuICAgIH0pKS5waXBlKHJldHJ5V2hlbihlcnJvcnMgPT5cbiAgICAgIGVycm9ycy5waXBlKFxuICAgICAgICBkZWxheSgxMDAwKVxuICAgICAgKSkpXG4gIH1cblxuXG4gIGdldEV4ZWN1dGlvblRyYWNlc0J5V3MoZG9tYWluSWQ6IHN0cmluZywgcHJvY2Vzc0lkOiBzdHJpbmcsIGV4ZWN1dGlvbklkOiBzdHJpbmcsIGZpbHRlcjogYW55KTogT2JzZXJ2YWJsZTxFeGVjdXRpb25EVE8+IHtcbiAgICByZXR1cm4gdGhpcy50cmFja2luZ1dlYnNvY2tldFNlcnZpY2UuY29ubmVjdChmaWx0ZXIpLnBpcGUobWFwKCh0cmFjZTogYW55KSA9PiB7XG4gICAgICBjb25zdCBleGVjdXRpb246IEV4ZWN1dGlvbiA9IHRyYWNlIGFzIEV4ZWN1dGlvbjtcbiAgICAgIGlmIChleGVjdXRpb24gIT0gbnVsbCAmJiBleGVjdXRpb24uZG9tYWluSWQgPT09IGRvbWFpbklkICYmIGV4ZWN1dGlvbi5wcm9jZXNzSWQgPT09IHByb2Nlc3NJZCAmJiBleGVjdXRpb24ub2JqZWN0SWQgPT09IGV4ZWN1dGlvbklkKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMucHJvY2Vzc0F1cmlvblRyYWNlKGV4ZWN1dGlvbik7XG4gICAgICB9XG4gICAgfSkpLnBpcGUocmV0cnlXaGVuKGVycm9ycyA9PlxuICAgICAgZXJyb3JzLnBpcGUoXG4gICAgICAgIGRlbGF5KDEwMDApXG4gICAgICApKSlcbiAgfVxuXG5cbiAgZ2V0RXhlY3V0aW9uc0J5V3MoZG9tYWluSWQ6IHN0cmluZywgcHJvY2Vzc0lkOiBzdHJpbmcsIGZpbHRlcjogYW55KTogT2JzZXJ2YWJsZTxFeGVjdXRpb25EVE8+IHtcbiAgICByZXR1cm4gdGhpcy50cmFja2luZ1dlYnNvY2tldFNlcnZpY2UuY29ubmVjdChmaWx0ZXIpLnBpcGUobWFwKCh0cmFjZTogYW55KSA9PiB7XG4gICAgICBjb25zdCBleGVjdXRpb246IEV4ZWN1dGlvbiA9IHRyYWNlIGFzIEV4ZWN1dGlvbjtcbiAgICAgIGlmIChleGVjdXRpb24gIT0gbnVsbCAmJiBleGVjdXRpb24uZG9tYWluSWQgPT09IGRvbWFpbklkICYmIGV4ZWN1dGlvbi5wcm9jZXNzSWQgPT09IHByb2Nlc3NJZCkge1xuICAgICAgICAgIHJldHVybiB0aGlzLnByb2Nlc3NBdXJpb25UcmFjZShleGVjdXRpb24pO1xuICAgICAgfVxuICAgIH0pKS5waXBlKHJldHJ5V2hlbihlcnJvcnMgPT5cbiAgICAgIGVycm9ycy5waXBlKFxuICAgICAgICBkZWxheSgxMDAwKVxuICAgICAgKSkpXG4gIH1cblxuICBnZXRFeGVjdXRpb25UcmFjZXMoZG9tYWluSWQ6IHN0cmluZywgZXhlY3V0aW9uSWQ6IHN0cmluZywgc3RhcnRUaW1lc3RhbXA6IHN0cmluZyk6IE9ic2VydmFibGU8RXhlY3V0aW9uRFRPW10+IHtcbiAgICByZXR1cm4gdGhpcy50cmFja2luZ1NlcnZpY2UuZ2V0KGRvbWFpbklkLCAnZXhlY3V0aW9uJywgZXhlY3V0aW9uSWQsIHN0YXJ0VGltZXN0YW1wKS5waXBlKG1hcCgodHJhY2VzOiBBcnJheTxUcmFjZT4pID0+IHtcbiAgICAgIHJldHVybiB0cmFjZXMubWFwKGl0ZW0gPT4gdGhpcy5wcm9jZXNzQXVyaW9uVHJhY2UoaXRlbSkpO1xuICAgIH0pKVxuICB9XG5cbiAgZ2V0RXhlY3V0aW9uVHJhY2VzUG9sbChkb21haW5JZDogc3RyaW5nLCBleGVjdXRpb25JZDogc3RyaW5nLCBzdGFydFRpbWVzdGFtcDogc3RyaW5nKTogT2JzZXJ2YWJsZTxFeGVjdXRpb25EVE9bXT4ge1xuICAgIHJldHVybiB0aGlzLnRyYWNraW5nU2VydmljZS5nZXQoZG9tYWluSWQsICdleGVjdXRpb24nLCBleGVjdXRpb25JZCwgc3RhcnRUaW1lc3RhbXApLnBpcGUobWFwKCh0cmFjZXM6IEFycmF5PFRyYWNlPikgPT4ge1xuICAgICAgcmV0dXJuIHRyYWNlcy5tYXAoaXRlbSA9PiB0aGlzLnByb2Nlc3NBdXJpb25UcmFjZShpdGVtKSk7XG4gICAgfSkpLnBpcGUoZGVsYXkoMTUwMDApKS5waXBlKHJlcGVhdCgpKTtcbiAgfVxuXG5cbiAgZ2V0RXhlY3V0aW9ucyhkb21haW5JZDogc3RyaW5nLCBwcm9jZXNzSWQ6IHN0cmluZyk6IE9ic2VydmFibGU8RXhlY3V0aW9uRFRPW10+IHtcbiAgICByZXR1cm4gdGhpcy5zdGF0ZVNlcnZpY2Uuc2VhcmNoRXhlY3V0aW9uc0J5UHJvY2Vzcyhkb21haW5JZCwgJ2V4ZWN1dGlvbicsIHByb2Nlc3NJZCkucGlwZShtYXAoKHRyYWNlczogQXJyYXk8VHJhY2U+KSA9PiB7XG4gICAgICByZXR1cm4gdHJhY2VzLm1hcChpdGVtID0+IHRoaXMucHJvY2Vzc0F1cmlvblRyYWNlKGl0ZW0pKTtcbiAgICB9KSlcbiAgfVxuXG4gIGdldEV4ZWN1dGlvbnNQb2xsKGRvbWFpbklkOiBzdHJpbmcsIHByb2Nlc3NJZDogc3RyaW5nKTogT2JzZXJ2YWJsZTxFeGVjdXRpb25EVE9bXT4ge1xuICAgIHJldHVybiB0aGlzLnN0YXRlU2VydmljZS5zZWFyY2hFeGVjdXRpb25zQnlQcm9jZXNzKGRvbWFpbklkLCAnZXhlY3V0aW9uJywgcHJvY2Vzc0lkKS5waXBlKG1hcCgodHJhY2VzOiBBcnJheTxUcmFjZT4pID0+IHtcbiAgICAgIHJldHVybiB0cmFjZXMubWFwKGl0ZW0gPT4gdGhpcy5wcm9jZXNzQXVyaW9uVHJhY2UoaXRlbSkpO1xuICAgIH0pKS5waXBlKGRlbGF5KDMwMDAwKSkucGlwZShyZXBlYXQoKSk7XG4gIH1cblxuICBjbG9zZVdlYnNvY2tldCgpIHtcbiAgICBpZiAoUHJvcGVydGllc1NlcnZpY2UucHJvcGVydGllcy50cmFja2luZ3dlYnNvY2tldCkge1xuICAgICAgdGhpcy50cmFja2luZ1dlYnNvY2tldFNlcnZpY2UuZGlzY29ubmVjdCgpO1xuICAgIH1cbiAgfVxuXG4gIGdldExhdGVzdEVuZGVkKHByb2Nlc3NlczogUHJvY2Vzc1tdKTogT2JzZXJ2YWJsZTxFeGVjdXRpb25EVE9bXT4ge1xuICAgIHJldHVybiBmb3JrSm9pbihwcm9jZXNzZXMubWFwKHByb2Nlc3MgPT4gdGhpcy5nZXRMYXN0RXhlY3V0aW9uKHByb2Nlc3MuZG9tYWluSWQsIHByb2Nlc3Mub2JqZWN0SWQpKSk7XG4gIH1cblxuICBnZXRMYXN0RXhlY3V0aW9uKGRvbWFpbklkOiBzdHJpbmcsIGlkOiBzdHJpbmcpOiBPYnNlcnZhYmxlPEV4ZWN1dGlvbkRUTz4ge1xuICAgIHJldHVybiB0aGlzLnN0YXRlU2VydmljZS5zZWFyY2hFeGVjdXRpb25zQnlQcm9jZXNzKGRvbWFpbklkLCAnZXhlY3V0aW9uJywgaWQpLnBpcGUobWFwKChzdGF0ZXM6IEFycmF5PFRyYWNlPikgPT4ge1xuICAgICAgaWYgKHN0YXRlcyA9PSBudWxsIHx8IHN0YXRlcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5wcm9jZXNzQXVyaW9uVHJhY2Uoc3RhdGVzWzBdKTtcbiAgICB9KSk7XG4gIH1cblxuICBnZXQoZG9tYWluSWQ6IHN0cmluZywgaWQ6IHN0cmluZyk6IE9ic2VydmFibGU8RXhlY3V0aW9uRFRPPiB7XG4gICAgcmV0dXJuIHRoaXMuc3RhdGVTZXJ2aWNlLmdldChkb21haW5JZCwgJ2V4ZWN1dGlvbicsIGlkKS5waXBlKG1hcCgoc3RhdGUpID0+IHtcbiAgICAgIGlmIChzdGF0ZSA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMucHJvY2Vzc0F1cmlvblRyYWNlKHN0YXRlKTtcbiAgICB9KSk7XG4gIH1cblxuICBnZXRFdmVudHMoZG9tYWluSWQ6IHN0cmluZywgZXhlY3V0aW9uSWQ6IHN0cmluZywgc3RhcnRUaW1lc3RhbXA6IG51bWJlcik6IE9ic2VydmFibGU8RXZlbnREVE9bXT4ge1xuICAgIHJldHVybiB0aGlzLmV2ZW50U2VydmljZS5nZXRFdmVudHNCeVN1YmplY3QoZG9tYWluSWQsICdleGVjdXRpb24nLCBzdGFydFRpbWVzdGFtcCwgXCJleGVjdXRpb25JZC5lcTpcIiArIGV4ZWN1dGlvbklkKS5waXBlKG1hcCggKGV2ZW50czogQXJyYXk8RXZlbnQ+KSA9PiB7XG4gICAgICByZXR1cm4gZXZlbnRzLm1hcChldmVudCA9PiB0aGlzLnByb2Nlc3NBdXJpb25FdmVudChldmVudCkpO1xuICAgIH0pKTtcbiAgfVxuXG4gIGdldEV2ZW50c1BvbGwoZG9tYWluSWQ6IHN0cmluZywgZXhlY3V0aW9uSWQ6IHN0cmluZywgc3RhcnRUaW1lc3RhbXA6IG51bWJlcik6IE9ic2VydmFibGU8RXZlbnREVE9bXT4ge1xuICAgIHJldHVybiB0aGlzLmV2ZW50U2VydmljZS5nZXRFdmVudHNCeVN1YmplY3QoZG9tYWluSWQsICdleGVjdXRpb24nLCBzdGFydFRpbWVzdGFtcCwgXCJleGVjdXRpb25JZC5lcTpcIiArIGV4ZWN1dGlvbklkKS5waXBlKG1hcCggKGV2ZW50czogQXJyYXk8RXZlbnQ+KSA9PiB7XG4gICAgICByZXR1cm4gZXZlbnRzLm1hcChldmVudCA9PiB0aGlzLnByb2Nlc3NBdXJpb25FdmVudChldmVudCkpO1xuICAgIH0pKS5waXBlKGRlbGF5KDEwMDApKS5waXBlKHJlcGVhdCgpKTs7XG4gIH1cblxuICBwcml2YXRlIHByb2Nlc3NBdXJpb25UcmFjZSh0cmFjZTogYW55KTogRXhlY3V0aW9uRFRPIHtcbiAgICBsZXQgZXhlY3V0aW9uID0gdHJhY2UgYXMgRXhlY3V0aW9uRFRPO1xuXG4gICAgZXhlY3V0aW9uLnRpbWVzdGFtcFN0YXJ0UHJldHR5ID0gdHJhY2Uuc3RhcnRlZEF0ID8gbW9tZW50KHRyYWNlLnN0YXJ0ZWRBdCkuZm9ybWF0KCdERC9NTS9ZWVlZIEhIOm1tOnNzJykgOiB1bmRlZmluZWQ7XG4gICAgZXhlY3V0aW9uLnRpbWVzdGFtcEZpbmFsUHJldHR5ID0gdHJhY2UuZmluaXNoZWRBdCA/IG1vbWVudCh0cmFjZS5maW5pc2hlZEF0KS5mb3JtYXQoJ0REL01NL1lZWVkgSEg6bW06c3MnKSA6IHVuZGVmaW5lZDtcbiAgICBleGVjdXRpb24udGltZUVsbGFwc2VkUHJldHR5ID0gdHJhY2UuZXhlY3V0aW9uVGltZSA/ICh0cmFjZS5leGVjdXRpb25UaW1lIC8gMTAwMCkgKyAncycgOiBudWxsXG4gICAgZXhlY3V0aW9uLnRpbWVzdGFtcFByZXR0eSA9IHRyYWNlLnRpbWVzdGFtcCA/IG1vbWVudCh0cmFjZS50aW1lc3RhbXApLmZvcm1hdCgnREQvTU0vWVlZWSBISDptbTpzcycpIDogdW5kZWZpbmVkO1xuICAgIHJldHVybiBleGVjdXRpb247XG4gIH1cblxuICBwcml2YXRlIHByb2Nlc3NBdXJpb25FdmVudChldmVudDogYW55KTogRXZlbnREVE8ge1xuICAgIGxldCBleGVjdXRpb25FdmVudCA9IGV2ZW50IGFzIEV2ZW50RFRPO1xuICAgIGV4ZWN1dGlvbkV2ZW50LnRpbWVzdGFtcFByZXR0eSA9IGV2ZW50LnRpbWVzdGFtcCA/IG1vbWVudChldmVudC50aW1lc3RhbXApLmZvcm1hdCgnREQvTU0vWVlZWSBISDptbTpzcycpIDogdW5kZWZpbmVkO1xuICAgIHJldHVybiBleGVjdXRpb25FdmVudDtcbiAgfVxuXG5cbn0iXX0=