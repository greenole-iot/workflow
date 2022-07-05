import { ParametersDefinition } from "./parameters-definition";
import { ProcessStep } from "./processStep";
export declare class Process {
    domainId: string;
    timespan: string;
    traceType: string;
    objectId: string;
    timestamp: number;
    subDomainId: string;
    tags: string[];
    version: string;
    name?: string;
    description?: string;
    executionType: any;
    executionData: any;
    hidden?: string;
    stages?: ProcessStep[];
    inputs?: {
        label: string;
        code: string;
    }[];
    outputs?: {
        label: string;
        code: string;
    }[];
    config?: any;
    state: any;
    supportedExecutionModes: string[];
    parameters: ParametersDefinition;
}
