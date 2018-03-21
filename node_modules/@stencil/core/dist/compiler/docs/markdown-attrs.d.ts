import { MemberMeta } from '../../util/interfaces';
export declare class MarkdownAttrs {
    private rows;
    addRow(memberMeta: MemberMeta): void;
    toMarkdown(): string[];
}
