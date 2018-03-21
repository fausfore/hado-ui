import { BuildCtx, CompilerCtx, ComponentMeta, Config, EntryModule, ModuleFile, StyleMeta } from '../../declarations';
import { ENCAPSULATION } from '../../util/constants';
export declare function generateStyles(config: Config, compilerCtx: CompilerCtx, buildCtx: BuildCtx, entryModules: EntryModule[]): Promise<void>;
export declare function generateComponentStyles(config: Config, compilerCtx: CompilerCtx, buildCtx: BuildCtx, moduleFile: ModuleFile): Promise<void>;
export declare function setStyleText(config: Config, compilerCtx: CompilerCtx, buildCtx: BuildCtx, cmpMeta: ComponentMeta, styleMeta: StyleMeta, styles: string[]): Promise<void>;
export declare function escapeCssForJs(style: string): string;
export declare function requiresScopedStyles(encapsulation: ENCAPSULATION): boolean;
