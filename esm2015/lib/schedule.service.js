import { Injectable } from '@angular/core';
import { PropertiesService } from '@alis/ng-base';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
export class ScheduleService {
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
ScheduleService.ɵfac = function ScheduleService_Factory(t) { return new (t || ScheduleService)(i0.ɵɵinject(i1.HttpClient)); };
ScheduleService.ɵprov = i0.ɵɵdefineInjectable({ token: ScheduleService, factory: ScheduleService.ɵfac, providedIn: 'root' });
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(ScheduleService, [{
        type: Injectable,
        args: [{
                providedIn: 'root'
            }]
    }], function () { return [{ type: i1.HttpClient }]; }, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NoZWR1bGUuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL3dvcmtmbG93L3NyYy9saWIvc2NoZWR1bGUuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRzNDLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGVBQWUsQ0FBQzs7O0FBUWxELE1BQU0sT0FBTyxlQUFlO0lBRTFCLFlBQW9CLElBQWdCO1FBQWhCLFNBQUksR0FBSixJQUFJLENBQVk7SUFBRyxDQUFDO0lBRXhDLCtDQUErQztJQUMvQyxtQkFBbUIsQ0FBQyxRQUFnQixFQUFFLFNBQWlCO1FBQ3JELE1BQU0sR0FBRyxHQUFHLGlCQUFpQixDQUFDLFVBQVUsQ0FBQyxrQkFBa0IsR0FBRyxHQUFHLEdBQUcsUUFBUSxHQUFHLFdBQVcsR0FBSSxTQUFTLENBQUM7UUFDeEcsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBa0IsR0FBRyxDQUFDLENBQUM7SUFDN0MsQ0FBQztJQUVELHdDQUF3QztJQUN4QyxzQkFBc0IsQ0FBQyxRQUFnQixFQUFFLFNBQWlCLEVBQUUsUUFBa0I7UUFDNUUsTUFBTSxHQUFHLEdBQUcsaUJBQWlCLENBQUMsVUFBVSxDQUFDLGtCQUFrQixHQUFHLEdBQUcsR0FBRyxRQUFRLEdBQUcsR0FBRyxHQUFJLFNBQVMsQ0FBQztRQUNoRyxRQUFRLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQyxTQUFTLElBQUssU0FBUyxDQUFDO1FBQ3RELE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLFFBQVEsRUFBRSxFQUFDLFlBQVksRUFBRSxNQUFNLEVBQUMsQ0FBQyxDQUFDO0lBQy9ELENBQUM7SUFFRCwyQ0FBMkM7SUFDM0MsY0FBYyxDQUFDLFFBQWdCLEVBQUUsVUFBa0I7UUFDakQsTUFBTSxHQUFHLEdBQUcsaUJBQWlCLENBQUMsVUFBVSxDQUFDLGtCQUFrQixHQUFHLEdBQUcsR0FBRyxRQUFRLEdBQUcsR0FBRyxHQUFJLFVBQVUsQ0FBQztRQUNqRyxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFNLEdBQUcsQ0FBQyxDQUFDO0lBQ3BDLENBQUM7OzhFQXJCVSxlQUFlO3VEQUFmLGVBQWUsV0FBZixlQUFlLG1CQUZkLE1BQU07a0RBRVAsZUFBZTtjQUgzQixVQUFVO2VBQUM7Z0JBQ1YsVUFBVSxFQUFFLE1BQU07YUFDbkIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBIdHRwQ2xpZW50LCBIdHRwUGFyYW1zIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xuaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgRmlsZVNlcnZpY2VNZXRhZGF0YSB9IGZyb20gJy4vbW9kZWwvZmlsZS1zZXJ2aWNlLW1ldGFkYXRhJztcbmltcG9ydCB7IFByb3BlcnRpZXNTZXJ2aWNlIH0gZnJvbSAnQGFsaXMvbmctYmFzZSc7XG5pbXBvcnQgeyBIdHRwSGVhZGVycyB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcbmltcG9ydCB7IG1hcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7IFNjaGVkdWxlIH0gZnJvbSAnLi9tb2RlbC9zY2hlZHVsZSc7XG5cbkBJbmplY3RhYmxlKHtcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnXG59KVxuZXhwb3J0IGNsYXNzIFNjaGVkdWxlU2VydmljZSB7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50KSB7fVxuXG4gIC8vIEdFVCAvc2NoZWR1bGUve2RvbWFpbklkfS9wcm9jZXNzL3twcm9jZXNzSWR9XG4gIGdldFByb2Nlc3NTY2hlZHVsZXMoZG9tYWluSWQ6IHN0cmluZywgcHJvY2Vzc0lkOiBzdHJpbmcpOiAgT2JzZXJ2YWJsZTxBcnJheTxTY2hlZHVsZT4+IHtcbiAgICBjb25zdCB1cmwgPSBQcm9wZXJ0aWVzU2VydmljZS5wcm9wZXJ0aWVzLnNjaGVkdWxlU2VydmljZVVybCArIFwiL1wiICsgZG9tYWluSWQgKyBcIi9wcm9jZXNzL1wiICsgIHByb2Nlc3NJZDtcbiAgICByZXR1cm4gdGhpcy5odHRwLmdldDxBcnJheTxTY2hlZHVsZT4+KHVybCk7XG4gIH1cblxuICAvLyBQT1NUIC9zY2hlZHVsZS97ZG9tYWluSWR9L3twcm9jZXNzSWR9XG4gIGNyZWF0ZU9yVXBkYXRlU2NoZWR1bGUoZG9tYWluSWQ6IHN0cmluZywgcHJvY2Vzc0lkOiBzdHJpbmcsIHNjaGVkdWxlOiBTY2hlZHVsZSk6IE9ic2VydmFibGU8c3RyaW5nPiB7XG4gICAgY29uc3QgdXJsID0gUHJvcGVydGllc1NlcnZpY2UucHJvcGVydGllcy5zY2hlZHVsZVNlcnZpY2VVcmwgKyBcIi9cIiArIGRvbWFpbklkICsgXCIvXCIgKyAgcHJvY2Vzc0lkO1xuICAgIHNjaGVkdWxlLnByb2Nlc3NJZCA9IHNjaGVkdWxlLnByb2Nlc3NJZCAgfHwgcHJvY2Vzc0lkO1xuICAgIHJldHVybiB0aGlzLmh0dHAucG9zdCh1cmwsIHNjaGVkdWxlLCB7cmVzcG9uc2VUeXBlOiAndGV4dCd9KTtcbiAgfVxuXG4gIC8vIERFTEVURSAvc2NoZWR1bGUve2RvbWFpbklkfS97c2NoZWR1bGVJZH1cbiAgZGVsZXRlU2NoZWR1bGUoZG9tYWluSWQ6IHN0cmluZywgc2NoZWR1bGVJZDogc3RyaW5nKTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgICBjb25zdCB1cmwgPSBQcm9wZXJ0aWVzU2VydmljZS5wcm9wZXJ0aWVzLnNjaGVkdWxlU2VydmljZVVybCArIFwiL1wiICsgZG9tYWluSWQgKyBcIi9cIiArICBzY2hlZHVsZUlkO1xuICAgIHJldHVybiB0aGlzLmh0dHAuZGVsZXRlPGFueT4odXJsKTtcbiAgfVxufVxuIl19