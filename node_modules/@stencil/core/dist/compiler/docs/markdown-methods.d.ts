import { MemberMeta } from '../../util/interfaces';
export declare class MarkdownMethods {
    private rows;
    addRow(memberName: string, memberMeta: MemberMeta): void;
    toMarkdown(): string[];
}
