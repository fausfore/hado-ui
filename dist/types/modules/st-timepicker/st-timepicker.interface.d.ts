import { Moment } from "moment";
export interface TimepickerState {
    value: Moment;
    format: string;
    labels: {
        title: string;
        btnValue: string;
        closeIcon: string;
        timeIcon: string;
        placeholder: string;
    };
}
