import { __awaiter } from "tslib";
import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PropertiesService } from '@alis/ng-base';
import { HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
export class FileServiceMetadataService {
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
FileServiceMetadataService.ɵfac = function FileServiceMetadataService_Factory(t) { return new (t || FileServiceMetadataService)(i0.ɵɵinject(i1.HttpClient)); };
FileServiceMetadataService.ɵprov = i0.ɵɵdefineInjectable({ token: FileServiceMetadataService, factory: FileServiceMetadataService.ɵfac, providedIn: 'root' });
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(FileServiceMetadataService, [{
        type: Injectable,
        args: [{
                providedIn: 'root'
            }]
    }], function () { return [{ type: i1.HttpClient }]; }, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsZS1zZXJ2aWNlLW1ldGFkYXRhLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy93b3JrZmxvdy9zcmMvbGliL2ZpbGUtc2VydmljZS1tZXRhZGF0YS5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQWMsVUFBVSxFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDOUQsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUczQyxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDbEQsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQ25ELE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQzs7O0FBS3JDLE1BQU0sT0FBTywwQkFBMEI7SUFFckMsWUFBb0IsSUFBZ0I7UUFBaEIsU0FBSSxHQUFKLElBQUksQ0FBWTtJQUFHLENBQUM7SUFHeEMsY0FBYyxDQUFDLFFBQWdCLEVBQUUsWUFBb0IsRUFBRSxVQUFtQjtRQUN4RSxJQUFJLEdBQUcsR0FBRyxVQUFVLElBQUksaUJBQWlCLENBQUMsVUFBVSxDQUFDLGNBQWMsR0FBRyxtQkFBbUIsQ0FBQztRQUMxRixJQUFJLE9BQU8sR0FBRztZQUNaLE9BQU8sRUFBRSxJQUFJLFdBQVcsRUFBRTtpQkFDdkIsR0FBRyxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUM7WUFDdkIsTUFBTSxFQUFFLElBQUksVUFBVSxFQUFFO2lCQUNyQixHQUFHLENBQUMsVUFBVSxFQUFFLFFBQVEsQ0FBQztpQkFDekIsR0FBRyxDQUFDLElBQUksRUFBRSxZQUFZLENBQUM7U0FDM0IsQ0FBQztRQUNGLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ3hDLENBQUM7SUFFRCxVQUFVLENBQUMsVUFBa0I7UUFDM0IsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUN0QyxDQUFDO0lBRUQsY0FBYyxDQUFDLHNCQUEyQyxFQUFFLFVBQW1CO1FBQzdFLElBQUksR0FBRyxHQUFHLFVBQVUsSUFBSSxpQkFBaUIsQ0FBQyxVQUFVLENBQUMsY0FBYyxHQUFHLG1CQUFtQixDQUFDO1FBQzFGLElBQUksT0FBTyxHQUFHO1lBQ1osT0FBTyxFQUFFLElBQUksV0FBVyxFQUFFO2lCQUN6QixHQUFHLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQztpQkFDcEIsR0FBRyxDQUFDLGNBQWMsRUFBRSxrQkFBa0IsQ0FBQztTQUN6QyxDQUFDO1FBQ0YsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBc0IsR0FBRyxFQUFFLHNCQUFzQixFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ25GLENBQUM7SUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7O01Ba0JFO0lBQ0YsVUFBVSxDQUFDLFVBQWtCLEVBQUUsSUFBVSxFQUFFLE9BQVk7UUFDckQsSUFBSSxPQUFPLEdBQUc7WUFDWixPQUFPLEVBQUUsT0FBTztTQUNqQixDQUFBO1FBQ0QsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBTSxVQUFVLEVBQUUsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ3ZELENBQUM7SUFFRCwrRkFBK0Y7SUFDL0Ysb0dBQW9HO0lBQ3BHOzs7Ozs7T0FNRztJQUNILElBQUksQ0FBQyxRQUFnQixFQUFFLElBQVksRUFBRSxRQUFrQixFQUFFLFVBQW1CLEVBQUUsS0FBYztRQUMxRixJQUFJLEdBQUcsR0FBRyxVQUFVLElBQUksaUJBQWlCLENBQUMsVUFBVSxDQUFDLGNBQWMsR0FBRyxtQkFBbUIsQ0FBQztRQUcxRixJQUFJLE1BQU0sR0FBSSxJQUFJLFVBQVUsRUFBRTthQUM3QixHQUFHLENBQUMsVUFBVSxFQUFFLFFBQVEsQ0FBQzthQUN6QixHQUFHLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQzthQUNqQixHQUFHLENBQUMsa0JBQWtCLEVBQUUsUUFBUSxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFckUsSUFBRyxLQUFLLElBQUksSUFBSSxFQUFDO1lBQ2YsTUFBTSxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFDLEtBQUssQ0FBQyxDQUFDO1NBQ3BDO1FBRUQsSUFBSSxPQUFPLEdBQUc7WUFDWixPQUFPLEVBQUUsSUFBSSxXQUFXLEVBQUUsQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQztZQUMvQyxNQUFNLEVBQUUsTUFBTTtTQUNmLENBQUM7UUFDRixPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUE2QixHQUFHLEVBQUUsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUNqRSxHQUFHLENBQUUsQ0FBQyxvQkFBZ0QsRUFBRSxFQUFFO1lBQ3hELE9BQU8sb0JBQW9CLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBc0IsRUFBRSxDQUFzQixFQUFFLEVBQUU7Z0JBQ2xGLE9BQU8sQ0FBQyxDQUFDLHFCQUFxQixHQUFHLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNwRSxDQUFDLENBQUMsQ0FBQTtRQUNKLENBQUMsQ0FBQyxDQUNILENBQUM7SUFDSixDQUFDO0lBRUQsYUFBYSxDQUFDLFFBQWdCLEVBQUUsTUFBYyxFQUFFLFVBQW1CO1FBQ2pFLElBQUksR0FBRyxHQUFHLFVBQVUsSUFBSSxpQkFBaUIsQ0FBQyxVQUFVLENBQUMsY0FBYyxHQUFHLG1CQUFtQixDQUFDO1FBQzFGLElBQUksT0FBTyxHQUFHO1lBQ1osT0FBTyxFQUFFLElBQUksV0FBVyxFQUFFO2lCQUN2QixHQUFHLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQztZQUN2QixNQUFNLEVBQUUsSUFBSSxVQUFVLEVBQUU7aUJBQ3JCLEdBQUcsQ0FBQyxVQUFVLEVBQUUsUUFBUSxDQUFDO2lCQUN6QixHQUFHLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQztTQUNyQixDQUFDO1FBQ0YsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDckMsQ0FBQztJQUVELFlBQVksQ0FBQyxZQUFpQztRQUM1QyxJQUFJLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQyxRQUFRLEVBQUUsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDLFNBQVMsQ0FBRSxVQUFVLENBQUMsRUFBRTtZQUN2RixJQUFJLFVBQVUsSUFBSSxJQUFJLEVBQUU7Z0JBQ3RCLE1BQU0sSUFBSSxHQUFHLFVBQVUsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUN0RixNQUFNLFFBQVEsR0FBd0IsVUFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFDO2dCQUM3RCxJQUFHLFFBQVEsSUFBSSxJQUFJLEVBQUU7b0JBQ25CLE9BQU8sQ0FBQyxJQUFJLENBQUMsMkJBQTJCLENBQUMsQ0FBQztvQkFDMUMsT0FBTyxJQUFJLENBQUM7aUJBQ2I7Z0JBQ0QsSUFBSSxRQUFRLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQztnQkFDN0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUMsUUFBUSxDQUFDLENBQUM7YUFDOUI7aUJBQU07Z0JBQ0wsT0FBTyxDQUFDLEtBQUssQ0FBQyxrQkFBa0IsRUFBRSxVQUFVLENBQUMsQ0FBQzthQUMvQztRQUVILENBQUMsRUFBRSxDQUFDLEtBQUssRUFBRSxFQUFFO1lBQ1gsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN2QixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFSyxRQUFRLENBQUMsR0FBRyxFQUFFLFFBQVE7O1lBQzFCLE1BQU0sQ0FBQyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDdEMsQ0FBQyxDQUFDLElBQUksR0FBRyxNQUFNLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDbkMsQ0FBQyxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7WUFDdEIsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDN0IsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ1osQ0FBQztLQUFBO0lBRUQsU0FBUyxDQUFDLEdBQUc7UUFDWCxPQUFPLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxRQUFRLEVBQUUsRUFBRTtZQUNsQyxPQUFPLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUN6QixDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDYixPQUFPLEdBQUcsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDbkMsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsUUFBUSxDQUFDLE1BQWMsRUFBRSxVQUFtQjtRQUMxQyxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7O29HQTlJVSwwQkFBMEI7a0VBQTFCLDBCQUEwQixXQUExQiwwQkFBMEIsbUJBRnpCLE1BQU07a0RBRVAsMEJBQTBCO2NBSHRDLFVBQVU7ZUFBQztnQkFDVixVQUFVLEVBQUUsTUFBTTthQUNuQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEh0dHBDbGllbnQsIEh0dHBQYXJhbXMgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XG5pbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBGaWxlU2VydmljZU1ldGFkYXRhIH0gZnJvbSAnLi9tb2RlbC9maWxlLXNlcnZpY2UtbWV0YWRhdGEnO1xuaW1wb3J0IHsgUHJvcGVydGllc1NlcnZpY2UgfSBmcm9tICdAYWxpcy9uZy1iYXNlJztcbmltcG9ydCB7IEh0dHBIZWFkZXJzIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xuaW1wb3J0IHsgbWFwIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5ASW5qZWN0YWJsZSh7XG4gIHByb3ZpZGVkSW46ICdyb290J1xufSlcbmV4cG9ydCBjbGFzcyBGaWxlU2VydmljZU1ldGFkYXRhU2VydmljZSB7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50KSB7fVxuXG5cbiAgcmVtb3ZlTWV0YWRhdGEoZG9tYWluSWQ6IHN0cmluZywgZmlsZU9iamVjdElkOiBzdHJpbmcsIHJlcG9zaXRvcnk/OiBzdHJpbmcpOiBPYnNlcnZhYmxlPGFueT4ge1xuICAgIGxldCB1cmwgPSByZXBvc2l0b3J5IHx8IFByb3BlcnRpZXNTZXJ2aWNlLnByb3BlcnRpZXMuZmlsZVNlcnZpY2VVcmwgKyBcIi9maWxlc2VydmljZS9maWxlXCI7XG4gICAgbGV0IG9wdGlvbnMgPSB7XG4gICAgICBoZWFkZXJzOiBuZXcgSHR0cEhlYWRlcnMoKVxuICAgICAgICAuc2V0KFwiYWNjZXB0XCIsIFwiKi8qXCIpLFxuICAgICAgcGFyYW1zOiBuZXcgSHR0cFBhcmFtcygpXG4gICAgICAgIC5zZXQoXCJkb21haW5JZFwiLCBkb21haW5JZClcbiAgICAgICAgLnNldChcImlkXCIsIGZpbGVPYmplY3RJZClcbiAgICB9O1xuICAgIHJldHVybiB0aGlzLmh0dHAuZGVsZXRlKHVybCwgb3B0aW9ucyk7XG4gIH1cblxuICByZW1vdmVGaWxlKHJlbW92ZUxpbms6IHN0cmluZyk6IE9ic2VydmFibGU8YW55PiB7XG4gICAgcmV0dXJuIHRoaXMuaHR0cC5kZWxldGUocmVtb3ZlTGluayk7XG4gIH1cblxuICB1cGxvYWRNZXRhZGF0YShuZXdGaWxlU2VydmljZU1ldGFkYXRhOiBGaWxlU2VydmljZU1ldGFkYXRhLCByZXBvc2l0b3J5Pzogc3RyaW5nKTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgICBsZXQgdXJsID0gcmVwb3NpdG9yeSB8fCBQcm9wZXJ0aWVzU2VydmljZS5wcm9wZXJ0aWVzLmZpbGVTZXJ2aWNlVXJsICsgXCIvZmlsZXNlcnZpY2UvZmlsZVwiO1xuICAgIGxldCBvcHRpb25zID0ge1xuICAgICAgaGVhZGVyczogbmV3IEh0dHBIZWFkZXJzKClcbiAgICAgIC5zZXQoXCJhY2NlcHRcIiwgXCIqLypcIilcbiAgICAgIC5zZXQoXCJjb250ZW50LXR5cGVcIiwgXCJhcHBsaWNhdGlvbi9qc29uXCIpXG4gICAgfTtcbiAgICByZXR1cm4gdGhpcy5odHRwLnBvc3Q8RmlsZVNlcnZpY2VNZXRhZGF0YT4odXJsLCBuZXdGaWxlU2VydmljZU1ldGFkYXRhLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qXG4gICAgb2JzOiB0aGUgaGVhZGVycyByZWNlaXZlZCBieSB0aGlzIG1ldGhvZCwgY29tZXMgaW4gdGhpcyBmb3JtYXQ6XG4gICAge1xuICAgICAgPGhlYWRlcjE+OiA8aGVhZGVyMSB2YWx1ZT4sXG4gICAgICA8aGVhZGVyMj46IDxoZWFkZXIyIHZhbHVlPlxuICAgICAgLlxuICAgICAgLlxuICAgICAgLlxuICAgIH1cblxuICAgIHdoZW4gcmVjZWl2aW5nIGhlYWRlcnMgYXMgSHR0cEhlYWRlcnMsIGJ1aWx0IGJ5IHRoZSBzZXJ2aWNlIGNvbnN1bWVyLCBcbiAgICB0aGUgaGVhZGVycyB0aGF0IHdlcmUgYWRkZWQgZ29lcyB0byBcImxhenlVcGRhdGVcIiBmaWVsZCBpbnNpZGUgSHR0cEhlYWRlcnNcbiAgICBpbnN0YW5jZSBpbnN0ZWFkIFwiaGVhZGVyc1wiIGZpZWxkLCB3aGljaCBsZWFkcyB0byBDT1JTIGVycm9yIGR1ZSB0aG9zZSBtYW5kYXRvcnlcbiAgICBoZWFkZXJzIGFyZSBub3QgYmVlbiBzZW50LlxuXG4gICAgaW4gb3JkZXIgdG8gc29sdmUgdGhpcywgdGhlIFwiaGVhZGVyc1wiIG9iamVjdCwgZGVtYW5kZWQgYnkgSHR0cENsaWVudCBtZXRob2RzLCBcbiAgICBhY2NlcHRzIGEgcGxhaW4gSlNPTiBvYmplY3QuIHRoZXJlZm9yZSwgdGhlIHNlcnZpY2UgY29uc3VtZXIgc2hvdWxkIHNlbmRcbiAgICBcImhlYWRlcnNcIiBhcyBhIHBsYWluIEpTT04gb2JqZWN0LlxuICAqL1xuICB1cGxvYWRGaWxlKHVwbG9hZExpbms6IHN0cmluZywgZmlsZTogRmlsZSwgaGVhZGVyczogYW55KTogT2JzZXJ2YWJsZTxhbnk+IHsgXG4gICAgbGV0IG9wdGlvbnMgPSB7XG4gICAgICBoZWFkZXJzOiBoZWFkZXJzXG4gICAgfVxuICAgIHJldHVybiB0aGlzLmh0dHAucHV0PGFueT4odXBsb2FkTGluaywgZmlsZSwgb3B0aW9ucyk7XG4gIH1cblxuICAvL1RPRE8gLSB2ZXJpZmljYXIgc2UgZXhpc3RlIHVtYSBmb3JtYSBkZSBqw6EgYnVzY2FyIG9zIG1ldGFkYWRvcyBvcmRlbmFkb3MgYXRyYXbDqXMgZG8gaW5kZXhpbmc7XG4gIC8vbyBtZXNtbyB2YWxlIHBhcmEgcHJvY2Vzc29zIGUgZXhlY3XDp8O1ZXM7IGVucXVhbnRvIGlzc28sIG8gZnJvbnQgb3JkZW5hIGFzIGxpc3RhcyBxdWFuZG8gbmVjZXNzw6FyaW9cbiAgLyoqXG4gICAqIFxuICAgKiBAcGFyYW0gZG9tYWluSWQgXG4gICAqIEBwYXJhbSBwYXRoIFxuICAgKiBAcGFyYW0gcmVwb3NpdG9yeSBcbiAgICogQHBhcmFtIHF1ZXJ5IEhUVFAgTGlzdCBvZiBmaWx0ZXJzIHVzaW5nIHRoZSBBdXJpb24gU2VhcmNoQ3JpdGVyaWEgcGF0dGVybjoga2V5Lm9wZXJhdGlvbjpmaWx0ZXJWYWx1ZVssb3RoZXJGaWx0ZXJWYWx1ZV0uIE9wZXJhdGlvbnM6IGVxL25lcS9zdy9ndC9lZ3QvbHQvZWx0LiAoZXg6IGF0dHJpYnV0ZTEuZXE6dGVzdFZhbHVlKVxuICAgKi9cbiAgbGlzdChkb21haW5JZDogc3RyaW5nLCBwYXRoOiBzdHJpbmcsIHN0cmljdGx5PzogYm9vbGVhbiwgcmVwb3NpdG9yeT86IHN0cmluZywgcXVlcnk/OiBzdHJpbmcgKTogT2JzZXJ2YWJsZTxBcnJheTxGaWxlU2VydmljZU1ldGFkYXRhPj4ge1xuICAgIGxldCB1cmwgPSByZXBvc2l0b3J5IHx8IFByb3BlcnRpZXNTZXJ2aWNlLnByb3BlcnRpZXMuZmlsZVNlcnZpY2VVcmwgKyBcIi9maWxlc2VydmljZS9saXN0XCI7XG5cblxuICAgIGxldCBwYXJhbXMgPSAgbmV3IEh0dHBQYXJhbXMoKVxuICAgIC5zZXQoXCJkb21haW5JZFwiLCBkb21haW5JZClcbiAgICAuc2V0KFwicGF0aFwiLCBwYXRoKVxuICAgIC5zZXQoXCJsb2NhdGlvblN0cmljdGx5XCIsIHN0cmljdGx5ICE9IG51bGwgPyBcIlwiICsgc3RyaWN0bHkgOiBcImZhbHNlXCIpO1xuXG4gICAgaWYocXVlcnkgIT0gbnVsbCl7XG4gICAgICBwYXJhbXMgPSBwYXJhbXMuc2V0KCdxdWVyeScscXVlcnkpO1xuICAgIH1cblxuICAgIGxldCBvcHRpb25zID0ge1xuICAgICAgaGVhZGVyczogbmV3IEh0dHBIZWFkZXJzKCkuc2V0KFwiYWNjZXB0XCIsIFwiKi8qXCIpLFxuICAgICAgcGFyYW1zOiBwYXJhbXNcbiAgICB9O1xuICAgIHJldHVybiB0aGlzLmh0dHAuZ2V0PEFycmF5PEZpbGVTZXJ2aWNlTWV0YWRhdGE+Pih1cmwsIG9wdGlvbnMpLnBpcGUoXG4gICAgICBtYXAoIChmaWxlU2VydmljZU1ldGFkYXRhczogQXJyYXk8RmlsZVNlcnZpY2VNZXRhZGF0YT4pID0+IHtcbiAgICAgICAgcmV0dXJuIGZpbGVTZXJ2aWNlTWV0YWRhdGFzLnNvcnQoKGE6IEZpbGVTZXJ2aWNlTWV0YWRhdGEsIGI6IEZpbGVTZXJ2aWNlTWV0YWRhdGEpID0+IHtcbiAgICAgICAgICByZXR1cm4gYS5jcmVhdGlvbkRhdGVUaW1lc3RhbXAgPiBiLmNyZWF0aW9uRGF0ZVRpbWVzdGFtcCA/IC0xIDogMTtcbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgKTtcbiAgfVxuXG4gIGdldEZpbGVEZXRhaWwoZG9tYWluSWQ6IHN0cmluZywgZmlsZUlkOiBzdHJpbmcsIHJlcG9zaXRvcnk/OiBzdHJpbmcpOiBPYnNlcnZhYmxlPGFueT4ge1xuICAgIGxldCB1cmwgPSByZXBvc2l0b3J5IHx8IFByb3BlcnRpZXNTZXJ2aWNlLnByb3BlcnRpZXMuZmlsZVNlcnZpY2VVcmwgKyBcIi9maWxlc2VydmljZS9maWxlXCI7XG4gICAgbGV0IG9wdGlvbnMgPSB7XG4gICAgICBoZWFkZXJzOiBuZXcgSHR0cEhlYWRlcnMoKVxuICAgICAgICAuc2V0KFwiYWNjZXB0XCIsIFwiKi8qXCIpLFxuICAgICAgcGFyYW1zOiBuZXcgSHR0cFBhcmFtcygpXG4gICAgICAgIC5zZXQoXCJkb21haW5JZFwiLCBkb21haW5JZClcbiAgICAgICAgLnNldChcImlkXCIsIGZpbGVJZClcbiAgICB9O1xuICAgIHJldHVybiB0aGlzLmh0dHAuZ2V0KHVybCwgb3B0aW9ucyk7XG4gIH1cblxuICBkb3dubG9hZEZpbGUoZmlsZU1ldGFkYXRhOiBGaWxlU2VydmljZU1ldGFkYXRhKTogdm9pZCB7XG4gICAgdGhpcy5nZXRGaWxlRGV0YWlsKGZpbGVNZXRhZGF0YS5kb21haW5JZCwgZmlsZU1ldGFkYXRhLm9iamVjdElkKS5zdWJzY3JpYmUoIGZpbGVEZXRhaWwgPT4ge1xuICAgICAgaWYgKGZpbGVEZXRhaWwgIT0gbnVsbCkge1xuICAgICAgICBjb25zdCBsaW5rID0gZmlsZURldGFpbC5tZXRhZGF0YS5saW5rID8gZmlsZURldGFpbC5tZXRhZGF0YS5saW5rIDogZmlsZURldGFpbFsnbGluayddO1xuICAgICAgICBjb25zdCBtZXRhZGF0YTogRmlsZVNlcnZpY2VNZXRhZGF0YSA9IGZpbGVEZXRhaWxbJ21ldGFkYXRhJ107XG4gICAgICAgIGlmKG1ldGFkYXRhID09IG51bGwpIHtcbiAgICAgICAgICBjb25zb2xlLndhcm4oJ21ldGFkYXRhIHJlY2VpdmVkIGlzIG51bGwnKTtcbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBsZXQgZmlsZU5hbWUgPSBtZXRhZGF0YS5uYW1lO1xuICAgICAgICB0aGlzLmRvd25sb2FkKGxpbmssZmlsZU5hbWUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihcInJlc3BvbnNlIGlzIG51bGxcIiwgZmlsZURldGFpbCk7XG4gICAgICB9XG5cbiAgICB9LCAoZXJyb3IpID0+IHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xuICAgIH0pO1xuICB9XG5cbiAgYXN5bmMgZG93bmxvYWQodXJsLCBmaWxlTmFtZSkge1xuICAgIGNvbnN0IGEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYVwiKTtcbiAgICBhLmhyZWYgPSBhd2FpdCB0aGlzLnRvRGF0YVVSTCh1cmwpO1xuICAgIGEuZG93bmxvYWQgPSBmaWxlTmFtZTtcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGEpO1xuICAgIGEuY2xpY2soKTtcbiAgfVxuXG4gIHRvRGF0YVVSTCh1cmwpIHtcbiAgICByZXR1cm4gZmV0Y2godXJsKS50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgcmV0dXJuIHJlc3BvbnNlLmJsb2IoKTtcbiAgICB9KS50aGVuKGJsb2IgPT4ge1xuICAgICAgcmV0dXJuIFVSTC5jcmVhdGVPYmplY3RVUkwoYmxvYik7XG4gICAgfSk7XG4gIH1cblxuICBnZXRCeXRlcyhmaWxlSWQ6IHN0cmluZywgcmVwb3NpdG9yeT86IHN0cmluZyk6IE9ic2VydmFibGU8QXJyYXlCdWZmZXI+IHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIC8vIGdldFJvb3RGb2xkZXIoKTogU3RvcmFibGVGb2xkZXIge1xuICAvLyAgIHJldHVybiB0aGlzLnJvb3RGb2xkZXI7XG4gIC8vIH1cbn1cbiJdfQ==