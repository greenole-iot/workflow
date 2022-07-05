import { DataSource } from "./data-source";
export declare class InputDefinition {
    label: string;
    required: boolean;
    code: string;
    type: string;
    valueDomain: any;
    domainSource: DataSource;
    range: string;
    rangeSource: DataSource;
    constructor();
}
