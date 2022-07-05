import { NgBaseLibModule } from '@alis/ng-base';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "@alis/ng-base";
export class WorkflowLibModule {
    constructor(propertiesService) {
        this.propertiesService = propertiesService;
        this.ready = false;
        this.propertiesService.readAllProperties().subscribe(() => {
            this.ready = true;
        });
    }
}
WorkflowLibModule.ɵmod = i0.ɵɵdefineNgModule({ type: WorkflowLibModule });
WorkflowLibModule.ɵinj = i0.ɵɵdefineInjector({ factory: function WorkflowLibModule_Factory(t) { return new (t || WorkflowLibModule)(i0.ɵɵinject(i1.PropertiesService)); }, imports: [[
            NgBaseLibModule,
            HttpClientModule
        ]] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && i0.ɵɵsetNgModuleScope(WorkflowLibModule, { imports: [NgBaseLibModule,
        HttpClientModule] }); })();
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(WorkflowLibModule, [{
        type: NgModule,
        args: [{
                declarations: [],
                imports: [
                    NgBaseLibModule,
                    HttpClientModule
                ],
                exports: []
            }]
    }], function () { return [{ type: i1.PropertiesService }]; }, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid29ya2Zsb3ctbGliLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL3dvcmtmbG93L3NyYy9saWIvd29ya2Zsb3ctbGliLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsZUFBZSxFQUFxQixNQUFNLGVBQWUsQ0FBQztBQUNuRSxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUN4RCxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDOzs7QUFVekMsTUFBTSxPQUFPLGlCQUFpQjtJQUk1QixZQUFvQixpQkFBb0M7UUFBcEMsc0JBQWlCLEdBQWpCLGlCQUFpQixDQUFtQjtRQUZ4RCxVQUFLLEdBQUcsS0FBSyxDQUFDO1FBR1osSUFBSSxDQUFDLGlCQUFpQixDQUFDLGlCQUFpQixFQUFFLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRTtZQUN4RCxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztRQUNwQixDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUM7O3FEQVJVLGlCQUFpQjtpSEFBakIsaUJBQWlCLG1EQU5uQjtZQUNQLGVBQWU7WUFDZixnQkFBZ0I7U0FDakI7d0ZBR1UsaUJBQWlCLGNBTDFCLGVBQWU7UUFDZixnQkFBZ0I7a0RBSVAsaUJBQWlCO2NBUjdCLFFBQVE7ZUFBQztnQkFDUixZQUFZLEVBQUUsRUFBRTtnQkFDaEIsT0FBTyxFQUFFO29CQUNQLGVBQWU7b0JBQ2YsZ0JBQWdCO2lCQUNqQjtnQkFDRCxPQUFPLEVBQUUsRUFBRTthQUNaIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmdCYXNlTGliTW9kdWxlLCBQcm9wZXJ0aWVzU2VydmljZSB9IGZyb20gJ0BhbGlzL25nLWJhc2UnO1xuaW1wb3J0IHsgSHR0cENsaWVudE1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcbmltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbkBOZ01vZHVsZSh7XG4gIGRlY2xhcmF0aW9uczogW10sXG4gIGltcG9ydHM6IFtcbiAgICBOZ0Jhc2VMaWJNb2R1bGUsXG4gICAgSHR0cENsaWVudE1vZHVsZVxuICBdLFxuICBleHBvcnRzOiBbXVxufSlcbmV4cG9ydCBjbGFzcyBXb3JrZmxvd0xpYk1vZHVsZSB7XG5cbiAgcmVhZHkgPSBmYWxzZTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHByb3BlcnRpZXNTZXJ2aWNlOiBQcm9wZXJ0aWVzU2VydmljZSkge1xuICAgIHRoaXMucHJvcGVydGllc1NlcnZpY2UucmVhZEFsbFByb3BlcnRpZXMoKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgdGhpcy5yZWFkeSA9IHRydWU7XG4gICAgfSlcbiAgfVxuXG59XG4iXX0=