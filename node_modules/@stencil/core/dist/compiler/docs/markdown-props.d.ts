import { MemberMeta } from '../../util/interfaces';
export declare class MarkdownProps {
    private rows;
    addRow(memberName: string, memberMeta: MemberMeta): void;
    toMarkdown(): string[];
}
