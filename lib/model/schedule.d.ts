export declare class Schedule {
    processId: string;
    objectId: string;
    name: string;
    executionMode: string;
    inputs: Array<{
        code: string;
        value: any;
    }>;
    dayOfMonth: number;
    cron: string;
    repetitionType: string;
    runAt: number;
    dayOfWeek: number;
    constructor();
}
