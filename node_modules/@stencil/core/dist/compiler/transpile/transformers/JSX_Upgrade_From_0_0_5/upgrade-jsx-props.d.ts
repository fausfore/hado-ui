import * as ts from 'typescript';
export default function upgradeJsxProps(transformContext: ts.TransformationContext): (tsSourceFile: ts.SourceFile) => ts.SourceFile;
