export declare class FileServiceMetadata {
    domainId: string;
    traceType: string;
    objectId: string;
    subDomainId: string;
    timestamp: number;
    tags: string;
    deletionDateTimestamp: number;
    link: string;
    entryType: string;
    creationDate: string;
    type: string;
    creationDateTimestamp: number;
    createdAt: string;
    path: Array<string>;
    lastAccessBy: string;
    size: number;
    createdBy: string;
    deletionDate: string;
    lastAccessDate: string;
    name: string;
    location: string;
    lastAccessDateTimestamp: number;
    state: string;
    static fromFile(domainId: string, file: File, user?: string): FileServiceMetadata;
    isFolder(): boolean;
}
