import { EventMeta } from '../../util/interfaces';
export declare class MarkdownEvents {
    private rows;
    addRow(eventMeta: EventMeta): void;
    toMarkdown(): string[];
}
