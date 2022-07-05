import { PropertiesService } from '@alis/ng-base';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import * as i0 from "@angular/core";
import * as i1 from "@alis/ng-base";
import * as i2 from "@angular/common/http";
export class ProcessService {
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
ProcessService.ɵfac = function ProcessService_Factory(t) { return new (t || ProcessService)(i0.ɵɵinject(i1.TrackingService), i0.ɵɵinject(i2.HttpClient)); };
ProcessService.ɵprov = i0.ɵɵdefineInjectable({ token: ProcessService, factory: ProcessService.ɵfac, providedIn: 'root' });
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(ProcessService, [{
        type: Injectable,
        args: [{
                providedIn: 'root'
            }]
    }], function () { return [{ type: i1.TrackingService }, { type: i2.HttpClient }]; }, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvY2Vzcy5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvd29ya2Zsb3cvc3JjL2xpYi9wcm9jZXNzLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLGlCQUFpQixFQUFtQixNQUFNLGVBQWUsQ0FBQztBQUVuRSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRTNDLE9BQU8sRUFBRSxHQUFHLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQzs7OztBQU1wQyxNQUFNLE9BQU8sY0FBYztJQUV6QixZQUFvQixlQUFnQyxFQUFVLElBQWdCO1FBQTFELG9CQUFlLEdBQWYsZUFBZSxDQUFpQjtRQUFVLFNBQUksR0FBSixJQUFJLENBQVk7SUFBSSxDQUFDO0lBRW5GOzs7O01BSUU7SUFFRixHQUFHLENBQUMsUUFBZ0I7UUFDbEIsT0FBTyxJQUFJLENBQUMsZUFBZSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUUsU0FBUyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQWlCLEVBQUUsRUFBRTtZQUN4RixPQUFPLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUU7Z0JBQ3hCLE9BQU8sS0FBZ0IsQ0FBQztZQUMxQixDQUFDLENBQUMsQ0FBQTtRQUNKLENBQUMsQ0FBQyxDQUFDLENBQUE7SUFDTCxDQUFDO0lBRUQsT0FBTyxDQUFDLFFBQWdCLEVBQUUsU0FBaUI7UUFDekMsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDekMsT0FBTyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLFFBQVEsSUFBSSxTQUFTLENBQUMsQ0FBQztRQUN4RCxDQUFDLENBQUMsQ0FBQyxDQUFBO0lBQ0wsQ0FBQztJQUVE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QUFNO1NBQ3JCLENBQUMsQ0FBQztJQUNMLENBQUM7OzRFQXBGVSxjQUFjO3NEQUFkLGNBQWMsV0FBZCxjQUFjLG1CQUZiLE1BQU07a0RBRVAsY0FBYztjQUgxQixVQUFVO2VBQUM7Z0JBQ1YsVUFBVSxFQUFFLE1BQU07YUFDbkIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBQcm9wZXJ0aWVzU2VydmljZSwgVHJhY2tpbmdTZXJ2aWNlIH0gZnJvbSAnQGFsaXMvbmctYmFzZSc7XG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xuaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgbWFwfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQgeyBQcm9jZXNzIH0gZnJvbSAnLi9tb2RlbC9wcm9jZXNzJztcblxuQEluamVjdGFibGUoe1xuICBwcm92aWRlZEluOiAncm9vdCdcbn0pXG5leHBvcnQgY2xhc3MgUHJvY2Vzc1NlcnZpY2Uge1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgdHJhY2tpbmdTZXJ2aWNlOiBUcmFja2luZ1NlcnZpY2UsIHByaXZhdGUgaHR0cDogSHR0cENsaWVudCkgeyB9XG5cbiAgLypcbiAgY2FkdSAgMzoxNSBQTVxuICBuYSBkb2MgZGEgbW9kZWxhZ2VtIGRvIHdvcmtmbG93cyBldSB0aXZlIHEgYWRpY2lvbmFyIG5hIEV4ZWN1w6fDo28gMiBjYW1wb3MsIG8gY29udGV4dCBlIGxvY2F0aW9uXG4gIGNvbnRleHQgw6kgbyBjbGllbnRlIChBRVMpIGUgbG9jYXRpb24gw6kgbyBwcm9jZXNzb1xuICAqL1xuXG4gIGdldChkb21haW5JZDogc3RyaW5nKTogT2JzZXJ2YWJsZTxQcm9jZXNzW10+IHtcbiAgICByZXR1cm4gdGhpcy50cmFja2luZ1NlcnZpY2UuZ2V0QnlUeXBlKGRvbWFpbklkLCAncHJvY2VzcycpLnBpcGUobWFwKCh0cmFjZXM6IFByb2Nlc3NbXSkgPT4ge1xuICAgICAgcmV0dXJuIHRyYWNlcy5tYXAodHJhY2UgPT4ge1xuICAgICAgICByZXR1cm4gdHJhY2UgYXMgUHJvY2VzcztcbiAgICAgIH0pXG4gICAgfSkpXG4gIH1cblxuICBnZXRCeUlkKGRvbWFpbklkOiBzdHJpbmcsIHByb2Nlc3NJZDogc3RyaW5nKTogT2JzZXJ2YWJsZTxQcm9jZXNzPiB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0KGRvbWFpbklkKS5waXBlKG1hcChpdGVtcyA9PiB7XG4gICAgICByZXR1cm4gaXRlbXMuZmluZChpdGVtID0+IGl0ZW0ub2JqZWN0SWQgPT0gcHJvY2Vzc0lkKTtcbiAgICB9KSlcbiAgfVxuXG4gIHNhdmUocHJvY2VzczogUHJvY2Vzcyk6IE9ic2VydmFibGU8YW55PiB7XG4gICAgcmV0dXJuIHRoaXMudHJhY2tpbmdTZXJ2aWNlLnNldChwcm9jZXNzKTtcbiAgfVxuXG4gIGV4ZWN1dGUoZG9tYWluSWQ6IHN0cmluZywgcHJvY2Vzc09iamVjdElkOiBzdHJpbmcsIGlucHV0czogeyBjb2RlOiBzdHJpbmcsIHZhbHVlOiBhbnkgfVtdLCBleGVjdXRpb25Nb2RlOiBzdHJpbmcgPSBcImRlZmF1bHRcIik6IE9ic2VydmFibGU8YW55PiB7XG5cbiAgICBsZXQgdXJsID0gYCR7UHJvcGVydGllc1NlcnZpY2UucHJvcGVydGllcy5maWxlU2VydmljZVVybH0vZXhlY3V0aW9uL3N0YXJ0LyR7ZG9tYWluSWR9LyR7cHJvY2Vzc09iamVjdElkfWA7XG4gICAgbGV0IHVzZXJKU09OID0gc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbSgndXNlcicpO1xuICAgIGxldCB1c2VyID0gdXNlckpTT04gIT0gbnVsbCAmJiB1c2VySlNPTiAhPSAnJyA/IEpTT04ucGFyc2UodXNlckpTT04pIDogXCJcIjtcblxuICAgIC8vIGxldCBpbnB1dHNQb3N0Rm9ybWF0ID0gaW5wdXRzLnJlZHVjZSgocHJldiwgY3VyKSA9PiB7IHByZXZbY3VyLmlkXSA9IGN1ci52YWx1ZTsgcmV0dXJuIHByZXYgfSwge30pO1xuXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5wb3N0KHVybCwgeyBwcm9jZXNzSWQ6IHByb2Nlc3NPYmplY3RJZCwgaW5wdXRzOiBpbnB1dHMsIGV4ZWN1dGlvbk1vZGU6IGV4ZWN1dGlvbk1vZGUgfSxcbiAgICAgIHtcbiAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICdBdXRob3JpemF0aW9uJzogJ0JlYXJlciAnICsgdXNlci5pZFRva2VuIFxuICAgICAgICB9XG4gICAgICB9KTtcbiAgfVxuXG4gIGNvbnRpbnVlKGRvbWFpbklkOiBzdHJpbmcsIGV4ZWN1dGlvbklkOiBzdHJpbmcsIGlucHV0czogeyBpZDogc3RyaW5nLCB2YWx1ZTogYW55IH1bXSk6IE9ic2VydmFibGU8YW55PiB7XG4gICAgbGV0IHVybCA9IGAke1Byb3BlcnRpZXNTZXJ2aWNlLnByb3BlcnRpZXMuZmlsZVNlcnZpY2VVcmx9L2V4ZWN1dGlvbi8ke2RvbWFpbklkfS8ke2V4ZWN1dGlvbklkfS9jb250aW51ZWA7XG5cbiAgICBsZXQgdXNlckpTT04gPSBzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKCd1c2VyJyk7XG4gICAgY29uc3QgcGFyc2VkVXNlckpTT04gPSB1c2VySlNPTiAhPSBudWxsICYmIHVzZXJKU09OICE9ICcnID8gSlNPTi5wYXJzZSh1c2VySlNPTikgOiBcIlwiO1xuXG4gICAgbGV0IHBheWxvYWQgPSB7XG4gICAgICBkb21haW5JZDogZG9tYWluSWQsXG4gICAgICBleGVjdXRpb25JZDogZXhlY3V0aW9uSWQsXG4gICAgICBpbnB1dHM6IGlucHV0cyxcbiAgICAgIHVzZXI6IHBhcnNlZFVzZXJKU09OLmlkVG9rZW5QYXlsb2FkPy5uaWNrbmFtZSB8fCBcIlwiLFxuICAgIH07XG5cbiAgICByZXR1cm4gdGhpcy5odHRwLnBvc3QodXJsLCBwYXlsb2FkLCBcbiAgICB7XG4gICAgICBoZWFkZXJzOiB7XG4gICAgICAgICdBdXRob3JpemF0aW9uJzogJ0JlYXJlciAnICsgcGFyc2VkVXNlckpTT04uaWRUb2tlblxuICAgIH0sXG4gICAgICByZXNwb25zZVR5cGU6ICd0ZXh0J1xuICAgIH0pO1xuICB9XG4gIFxuICAvL2NvbnRpbnVlIG92ZXJyaWRpbmcgc3RhZ2VJbmRleFxuICBjb250aW51ZU92ZXJyaWRpbmdTdGFnZShkb21haW5JZDogc3RyaW5nLCBleGVjdXRpb25JZDogc3RyaW5nLCBpbnB1dHM6IHsgaWQ6IHN0cmluZywgdmFsdWU6IGFueSB9W10sIG92ZXJyaWRlU3RhZ2VJbmRleDogbnVtYmVyKTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgICBsZXQgdXJsID0gYCR7UHJvcGVydGllc1NlcnZpY2UucHJvcGVydGllcy5maWxlU2VydmljZVVybH0vZXhlY3V0aW9uLyR7ZG9tYWluSWR9LyR7ZXhlY3V0aW9uSWR9L2NvbnRpbnVlP292ZXJyaWRlU3RhZ2VJbmRleD0ke292ZXJyaWRlU3RhZ2VJbmRleH1gO1xuXG4gICAgbGV0IHVzZXJKU09OID0gc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbSgndXNlcicpO1xuICAgIGNvbnN0IHBhcnNlZFVzZXJKU09OID0gdXNlckpTT04gIT0gbnVsbCAmJiB1c2VySlNPTiAhPSAnJyA/IEpTT04ucGFyc2UodXNlckpTT04pIDogXCJcIjtcblxuICAgIGxldCBwYXlsb2FkID0ge1xuICAgICAgaW5wdXRzOiBpbnB1dHNcbiAgICB9O1xuXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5wb3N0KHVybCwgcGF5bG9hZCwgXG4gICAge1xuICAgICAgaGVhZGVyczoge1xuICAgICAgICAnQXV0aG9yaXphdGlvbic6ICdCZWFyZXIgJyArIHBhcnNlZFVzZXJKU09OLmlkVG9rZW5cbiAgICB9LFxuICAgICAgcmVzcG9uc2VUeXBlOiAndGV4dCdcbiAgICB9KTtcbiAgfVxufVxuIl19