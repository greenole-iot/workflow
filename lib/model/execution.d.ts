export declare class Execution {
    objectId: string;
    domainId: string;
    subDomainId: string;
    processId: string;
    client: string;
    startedAt: number;
    startedAtTimestamp: number;
    finishedAt: number;
    finishedAtTimestamp: number;
    executionTime: number;
    stage: string;
    state: string;
    errors: any;
    user: any;
    inputs: any;
    outputs: any;
    executionMode: string;
    config: any;
    parentId: string;
    domainData: any;
}
