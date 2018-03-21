import { ModuleFiles } from '../../../../declarations';
import * as ts from 'typescript';
export default function upgradeFromMetadata(moduleFiles: ModuleFiles): (tsSourceFile: ts.SourceFile) => ts.SourceFile;
