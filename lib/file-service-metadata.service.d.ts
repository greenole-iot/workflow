import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FileServiceMetadata } from './model/file-service-metadata';
import * as i0 from "@angular/core";
export declare class FileServiceMetadataService {
    private http;
    constructor(http: HttpClient);
    removeMetadata(domainId: string, fileObjectId: string, repository?: string): Observable<any>;
    removeFile(removeLink: string): Observable<any>;
    uploadMetadata(newFileServiceMetadata: FileServiceMetadata, repository?: string): Observable<any>;
    uploadFile(uploadLink: string, file: File, headers: any): Observable<any>;
    /**
     *
     * @param domainId
     * @param path
     * @param repository
     * @param query HTTP List of filters using the Aurion SearchCriteria pattern: key.operation:filterValue[,otherFilterValue]. Operations: eq/neq/sw/gt/egt/lt/elt. (ex: attribute1.eq:testValue)
     */
    list(domainId: string, path: string, strictly?: boolean, repository?: string, query?: string): Observable<Array<FileServiceMetadata>>;
    getFileDetail(domainId: string, fileId: string, repository?: string): Observable<any>;
    downloadFile(fileMetadata: FileServiceMetadata): void;
    download(url: any, fileName: any): Promise<void>;
    toDataURL(url: any): Promise<string>;
    getBytes(fileId: string, repository?: string): Observable<ArrayBuffer>;
    static ɵfac: i0.ɵɵFactoryDef<FileServiceMetadataService, never>;
    static ɵprov: i0.ɵɵInjectableDef<FileServiceMetadataService>;
}
